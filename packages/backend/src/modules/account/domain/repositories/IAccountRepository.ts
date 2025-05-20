import { RepositoryOptions } from '../../../../infrastructure/orm/RepositoryOptions';
import { Account } from '../entities/Account';

export interface IAccountRepository {
  save(account: Account, options?: RepositoryOptions): Promise<void>;
}
