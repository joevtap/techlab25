import { Account } from '../entities/Account';
import { AccountNumber, Id } from '../entities/types';

import { IRepository } from './IRepository';

export interface IAccountRepository extends IRepository<Account> {
  findByOwnerId(ownerId: Id): Promise<Account[]>;
  findByNumber(number: AccountNumber): Promise<Account | null>;
}
