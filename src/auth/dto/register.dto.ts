import { IsEmail, IsNotEmpty, IsString } from 'class-validator';
import { IsNotCommonPassword } from '../common-password.validator';

export class RegisterDto {
  @IsString()
  @IsNotEmpty()
  name: string;

  @IsEmail()
  email: string;

  @IsString()
  @IsNotEmpty()
  @IsNotCommonPassword()
  password: string;
}
