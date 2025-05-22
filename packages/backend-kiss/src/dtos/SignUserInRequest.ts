import { Email, Password } from '../entities/types';

export type SignUserInRequest = {
  email: Email;
  password: Password;
};
