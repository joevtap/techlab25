import { Id } from '../../../../core/domain/value-objects';
import { Account } from '../entities/Account';
import { AccountNumber } from '../value-objects/AccountNumber';

export interface IAccountRepository {
  findById(id: Id, transactionId?: symbol): Promise<Account | null>;
  findByAccountNumber(
    accountNumber: AccountNumber,
    transactionId?: symbol,
  ): Promise<Account | null>;
  findAllByOwnerId(
    ownerId: Id,
    transactionId?: symbol,
  ): Promise<Account[] | null>;
  save(account: Account, transactionId?: symbol): Promise<void>;
  delete(id: Id, transactionId?: symbol): Promise<void>;
  update(account: Partial<Account>, transactionId?: symbol): Promise<void>;
}
