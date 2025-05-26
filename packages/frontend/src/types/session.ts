import type { Token } from './types';
import type { User } from './user';

export type Session = {
  user: User;
  token: Token;
};
