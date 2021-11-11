import { Controller, Post, Body, UseGuards, Req, Get } from '@nestjs/common';
import { AuthService } from './auth.service';
import { CookieAuthenticationGuard } from './cookie-auth.guard';
import { LoginDto } from './dto/login.dto';
import { RegisterDto } from './dto/register.dto';
import { LogInWithCredentialsGuard } from './login.guard';
import { RequestWithUser } from './types/resquest-with-user';

@Controller('auth')
export class AuthController {
  constructor(private readonly authService: AuthService) {}

  @Post('register')
  async register(@Body() registerDto: RegisterDto) {
    return this.authService.register(registerDto);
  }

  @Post('login')
  @UseGuards(LogInWithCredentialsGuard)
  async login(@Body() loginDto: LoginDto) {
    const { password, ...user } = await this.authService.login(loginDto);
    return user;
  }

  @UseGuards(CookieAuthenticationGuard)
  @Get('me')
  async getMe(@Req() request: RequestWithUser) {
    const { password, ...user } = request.user;
    return user;
  }

  @UseGuards(CookieAuthenticationGuard)
  @Post('logout')
  async logout(@Req() request: RequestWithUser) {
    request.logOut();
    request.session.cookie.maxAge = 0;
  }
}
