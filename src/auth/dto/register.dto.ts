import {
  IsEmail,
  IsNotEmpty,
  IsString,
  MaxLength,
  MinLength,
} from 'class-validator';
import { IsNotCommonPassword } from '../validators/common-password.validator';
import { IsUniqueEmail } from '../validators/is-unique-email.validator';

export class RegisterDto {
  @IsString()
  @IsNotEmpty()
  name: string;

  @IsEmail()
  @IsUniqueEmail()
  email: string;

  @IsString()
  @IsNotEmpty()
  @IsNotCommonPassword()
  @MinLength(8)
  @MaxLength(64)
  password: string;
}
