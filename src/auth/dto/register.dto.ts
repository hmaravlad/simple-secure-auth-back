import {
  IsEmail,
  IsNotEmpty,
  IsPhoneNumber,
  IsString,
  Matches,
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

  @IsPhoneNumber()
  phone: string;

  @IsString()
  @IsNotEmpty()
  @IsNotCommonPassword()
  @MinLength(10)
  @MaxLength(64)
  @Matches(/[a-zA-Z]/, {
    message: 'Password should contain at least one english letter',
  })
  @Matches(/[0-9]/, { message: 'Password should contain at least one number' })
  @Matches(/[^0-9a-zA-Z]/, {
    message: 'Password should contain at least one special symbol',
  })
  password: string;
}
