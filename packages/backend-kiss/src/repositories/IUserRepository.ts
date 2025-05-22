import { Email } from '../entities/types';
import { User } from '../entities/User';

import { IRepository } from './IRepository';

export interface IUserRepository extends IRepository<User> {
  findByEmail(email: Email): Promise<User | null>;
}
