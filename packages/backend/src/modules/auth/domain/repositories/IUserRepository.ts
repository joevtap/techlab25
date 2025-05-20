import { Id, Email } from '../../../../core/domain/value-objects';
import { RepositoryOptions } from '../../../../infrastructure/orm/RepositoryOptions';
import { User } from '../entities/User';

export interface IUserRepository {
  findById(id: Id, options?: RepositoryOptions): Promise<User | null>;
  findByEmail(email: Email, options?: RepositoryOptions): Promise<User | null>;
  save(user: User, options?: RepositoryOptions): Promise<void>;
}
