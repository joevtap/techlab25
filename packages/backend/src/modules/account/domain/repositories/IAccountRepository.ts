import { Account } from '../entities/Account';
import { AccountNumber } from '../value-objects/AccountNumber';

export interface IAccountRepository {
  findByAccountNumber(
    accountNumber: AccountNumber,
    transactionId?: symbol,
  ): Promise<Account | null>;
  save(account: Account, transactionId?: symbol): Promise<void>;
}
