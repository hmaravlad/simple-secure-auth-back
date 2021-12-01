import { Injectable } from '@nestjs/common';
import {
  ValidatorConstraint,
  ValidatorConstraintInterface,
  ValidationOptions,
  registerDecorator,
} from 'class-validator';
import { AuthQueries } from '../auth.queries';

@ValidatorConstraint({ async: true })
@Injectable()
export class IsUniqueEmailValidator implements ValidatorConstraintInterface {
  private passwords: string[];

  constructor(private readonly authQueries: AuthQueries) {}

  validate(value: string) {
    return this.authQueries
      .getUserByEmail(value)
      .then((user) => user === undefined);
  }

  defaultMessage() {
    return `Specified email is already used`;
  }
}
export function IsUniqueEmail(validationOptions?: ValidationOptions) {
  return function (object: unknown, propertyName: string) {
    registerDecorator({
      target: object.constructor,
      propertyName: propertyName,
      options: validationOptions,
      validator: IsUniqueEmailValidator,
    });
  };
}
