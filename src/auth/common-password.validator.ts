import { Injectable } from '@nestjs/common';
import {
  ValidatorConstraint,
  ValidatorConstraintInterface,
  ValidationOptions,
  registerDecorator,
} from 'class-validator';
import { CommonPasswordsProvider } from './common-passwords.provider';

@ValidatorConstraint()
@Injectable()
export class IsNotCommonPasswordValidator
  implements ValidatorConstraintInterface
{
  private passwords: string[];

  constructor(
    private readonly commonPasswordsProvider: CommonPasswordsProvider,
  ) {
    this.passwords = this.commonPasswordsProvider.getPasswords();
  }

  validate(value: string) {
    return !this.passwords.includes(value);
  }

  defaultMessage() {
    return `This password is too common, please choose more reliable password`;
  }
}
export function IsNotCommonPassword(validationOptions?: ValidationOptions) {
  return function (object: unknown, propertyName: string) {
    registerDecorator({
      target: object.constructor,
      propertyName: propertyName,
      options: validationOptions,
      validator: IsNotCommonPasswordValidator,
    });
  };
}
