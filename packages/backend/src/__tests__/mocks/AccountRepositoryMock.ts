import { Account } from '../../entities/Account';
import { AccountNumber, Id } from '../../entities/types';
import { IAccountRepository } from '../../repositories/IAccountRepository';

export class AccountRepositoryMock implements IAccountRepository {
  private accounts: Map<Id, Account> = new Map();
  private accountNumberIndex: Map<AccountNumber, Account> = new Map();
  private ownerIndex: Map<Id, Account[]> = new Map();

  async findById(id: Id): Promise<Account | null> {
    return this.accounts.get(id) || null;
  }

  async findAll(): Promise<Account[]> {
    return Array.from(this.accounts.values());
  }

  async add(entity: Account): Promise<Account> {
    if (this.accounts.has(entity.id)) {
      throw new Error(`Account with id ${entity.id} already exists`);
    }

    this.accounts.set(entity.id, entity);
    this.accountNumberIndex.set(entity.number, entity);

    const ownerAccounts = this.ownerIndex.get(entity.ownerId) || [];
    ownerAccounts.push(entity);
    this.ownerIndex.set(entity.ownerId, ownerAccounts);

    return entity;
  }

  async update(entity: Account): Promise<Account> {
    const existingAccount = await this.findById(entity.id);

    if (!existingAccount) {
      throw new Error(`Account with id ${entity.id} not found`);
    }

    if (existingAccount.number !== entity.number) {
      this.accountNumberIndex.delete(existingAccount.number);
      this.accountNumberIndex.set(entity.number, entity);
    } else {
      this.accountNumberIndex.set(entity.number, entity);
    }

    if (existingAccount.ownerId !== entity.ownerId) {
      const oldOwnerAccounts =
        this.ownerIndex.get(existingAccount.ownerId) || [];
      this.ownerIndex.set(
        existingAccount.ownerId,
        oldOwnerAccounts.filter((acc) => acc.id !== entity.id),
      );

      const newOwnerAccounts = this.ownerIndex.get(entity.ownerId) || [];
      newOwnerAccounts.push(entity);
      this.ownerIndex.set(entity.ownerId, newOwnerAccounts);
    } else {
      const ownerAccounts = this.ownerIndex.get(entity.ownerId) || [];
      const updatedOwnerAccounts = ownerAccounts.map((acc) =>
        acc.id === entity.id ? entity : acc,
      );
      this.ownerIndex.set(entity.ownerId, updatedOwnerAccounts);
    }

    this.accounts.set(entity.id, entity);
    return entity;
  }

  async remove(id: Id): Promise<void> {
    const account = this.accounts.get(id);

    if (account) {
      this.accountNumberIndex.delete(account.number);

      const ownerAccounts = this.ownerIndex.get(account.ownerId) || [];
      this.ownerIndex.set(
        account.ownerId,
        ownerAccounts.filter((acc) => acc.id !== id),
      );

      this.accounts.delete(id);
    }
  }

  async findByOwnerId(ownerId: Id): Promise<Account[]> {
    return this.ownerIndex.get(ownerId) || [];
  }

  async findByNumber(number: AccountNumber): Promise<Account | null> {
    return this.accountNumberIndex.get(number) || null;
  }

  reset(): void {
    this.accounts.clear();
    this.accountNumberIndex.clear();
    this.ownerIndex.clear();
  }

  addAccountData(account: Account): void {
    this.accounts.set(account.id, account);
    this.accountNumberIndex.set(account.number, account);

    const ownerAccounts = this.ownerIndex.get(account.ownerId) || [];
    ownerAccounts.push(account);
    this.ownerIndex.set(account.ownerId, ownerAccounts);
  }
}
