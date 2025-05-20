import { Account } from '../../modules/account/domain/entities/Account';
import { IAccountRepository } from '../../modules/account/domain/repositories/IAccountRepository';
import { AccountNumber } from '../../modules/account/domain/value-objects/AccountNumber';
import {
  AccountType,
  AccountTypeEnum,
} from '../../modules/account/domain/value-objects/AccountType';
import { Balance } from '../../modules/account/domain/value-objects/Balance';
import { Id } from '../domain/value-objects';

export class MockAccountRepository implements IAccountRepository {
  public accounts: Account[] = [];

  public async findByAccountNumber(
    accountNumber: AccountNumber,
  ): Promise<Account | null> {
    const account = this.accounts.find((a) =>
      a.accountNumber.equals(accountNumber),
    );
    return account || null;
  }

  public async save(account: Account): Promise<void> {
    const existingAccountIndex = this.accounts.findIndex((a) =>
      a.accountNumber.equals(account.accountNumber),
    );

    if (existingAccountIndex >= 0) {
      this.accounts[existingAccountIndex] = account;
    } else {
      this.accounts.push(account);
    }
  }

  public async delete(accountNumber: AccountNumber): Promise<void> {
    this.accounts = this.accounts.filter(
      (a) => !a.accountNumber.equals(accountNumber),
    );
  }

  public async addExistingAccount(accountData: {
    id: string;
    accountNumber: string;
    balance?: number;
    type?: AccountTypeEnum;
    ownerId?: string;
  }): Promise<Account> {
    const accountNumber = new AccountNumber(accountData.accountNumber);
    const balance = new Balance(accountData.balance ?? 0);
    const type = new AccountType(accountData.type ?? 'CHECKING');
    const id = new Id(accountData.id);
    const ownerId = new Id(accountData.ownerId ?? 'owner-id');

    const account = Account.create({
      id,
      accountNumber,
      type,
      balance,
      ownerId,
    });

    await this.save(account);
    return account;
  }

  public clear(): void {
    this.accounts = [];
  }
}
