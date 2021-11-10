import { Password } from '../entities/password.entity';

export class CreateUserDto {
  name: string;
  email: string;
  password: Password;
}
