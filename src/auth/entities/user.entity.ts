import { Password } from './password.entity';

export class User {
  id: number;
  name: string;
  email: string;
  password: Password;
}
