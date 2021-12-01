import { Session } from 'express-session';
import { User } from '../entities/user.entity';

export interface RequestWithUser extends Request {
  user: User;
  logOut: () => void;
  session: Session;
}
