import { BusinessRuleViolationError } from '../errors/BusinessRuleViolationError';
import { InsufficientFundsError } from '../errors/InsufficientFundsError';

import { BaseEntity } from './Base';
import { AccountName, AccountNumber, AccountType, Id, Money } from './types';

export class Account extends BaseEntity {
  public constructor(
    public readonly id: Id,
    public readonly type: AccountType,
    public readonly name: AccountName,
    public readonly number: AccountNumber,
    public readonly balance: Money,
    public readonly ownerId: Id,
  ) {
    super(id);
  }

  public deposit(amount: Money): Account {
    if (amount <= 0) {
      throw new BusinessRuleViolationError('Deposit amount must be positive');
    }

    const newBalance = this.balance + amount;

    return new Account(
      this.id,
      this.type,
      this.name,
      this.number,
      newBalance,
      this.ownerId,
    );
  }

  public withdraw(amount: Money): Account {
    if (amount <= 0) {
      throw new BusinessRuleViolationError(
        'Withdrawal amount must be positive',
      );
    }

    if (this.balance < amount) {
      throw new InsufficientFundsError('cannot withdraw amount');
    }

    const newBalance = this.balance - amount;

    return new Account(
      this.id,
      this.type,
      this.name,
      this.number,
      newBalance,
      this.ownerId,
    );
  }
}
