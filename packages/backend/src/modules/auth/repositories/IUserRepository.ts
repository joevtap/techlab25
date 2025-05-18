import { Id } from '@core/domain/value-objects';
import { User } from '../domain/entities/User';

export interface IUserRepository {
  findById(id: Id): Promise<User | null>;
  save(user: User): Promise<void>;
}
