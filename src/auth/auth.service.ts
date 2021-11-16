import {
  ForbiddenException,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import { AuthQueries } from './auth.queries';
import { LoginDto } from './dto/login.dto';
import { RegisterDto } from './dto/register.dto';
import { EncryptionService } from './encryption/encryption.service';
import { User } from './entities/user.entity';
import { PasswordHashingService } from './hashing/hashing.service';

@Injectable()
export class AuthService {
  constructor(
    private readonly authQueries: AuthQueries,
    private readonly hashingService: PasswordHashingService,
    private readonly encryptionService: EncryptionService,
  ) {}

  async register(registerDto: RegisterDto): Promise<void> {
    const { password, ...user } = registerDto;
    const { hash, salt } = await this.hashingService.hashPassword(password);
    user.phone = await this.encryptionService.encrypt(user.phone);
    await this.authQueries.insertUser(user, {
      hash,
      salt,
      compromised: false,
      updatedTo: 0,
      version: this.hashingService.getLastVersionNumber(),
    });
  }

  async login({ email, password }: LoginDto): Promise<User> {
    const user = await this.authQueries.getUserByEmail(email);
    user.phone = await this.encryptionService.decrypt(user.phone);
    if (!user)
      throw new ForbiddenException('Invalid email and password combination');
    const { hash, salt, version, updatedTo } = user.password;
    const isValid = await this.hashingService.checkPassword(
      password,
      hash,
      salt,
      version,
      updatedTo,
    );
    if (!isValid)
      throw new ForbiddenException('Invalid email and password combination');
    if (updatedTo !== 0) {
      await this.hashingService.updateHash(password, user.password.id);
    }
    return user;
  }

  async getUserById(id: number): Promise<User> {
    const user = await this.authQueries.getUserById(id);
    user.phone = await this.encryptionService.decrypt(user.phone);
    if (!user) throw new NotFoundException(`No user with this id`);
    return user;
  }

  logout() {
    return `Logout`;
  }
}
