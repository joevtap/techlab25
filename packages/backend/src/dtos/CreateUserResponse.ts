import { Id, Email, Username } from '../entities/types';

export type CreateUserResponse = {
  id: Id;
  email: Email;
  username: Username;
};
