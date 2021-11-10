import { Injectable } from '@nestjs/common';
import { LoginDto } from './dto/login.dto';
import { RegisterDto } from './dto/register.dto';

@Injectable()
export class AuthService {
  register(registerDto: RegisterDto) {
    return 'Register';
  }

  login(loginDto: LoginDto) {
    return `Login`;
  }

  logout() {
    return `Logout`;
  }
}
