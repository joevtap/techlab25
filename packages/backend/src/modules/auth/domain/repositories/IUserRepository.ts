import { Email, Id } from '@core/domain/value-objects';
import { User } from '../entities/User';

export interface IUserRepository {
  findById(id: Id): Promise<User | null>;
  findByEmail(email: Email): Promise<User | null>;
  save(user: User): Promise<void>;
}
