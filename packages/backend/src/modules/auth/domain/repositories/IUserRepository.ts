import { Id, Email } from '../../../../core/domain/value-objects';
import { User } from '../entities/User';

export interface IUserRepository {
  findById(id: Id, transactionId?: symbol): Promise<User | null>;
  findByEmail(email: Email, transactionId?: symbol): Promise<User | null>;
  save(user: User, transactionId?: symbol): Promise<void>;
}
