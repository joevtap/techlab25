import { Email, Username, Password } from '../entities/types';

export type CreateUserRequest = {
  email: Email;
  username: Username;
  password: Password;
};
