import { BaseEntity } from '../../../../core/domain/entities';
import { ValidationError } from '../../../../core/domain/errors';
import { Id } from '../../../../core/domain/value-objects/Id';
import { InsufficientFundsError } from '../errors/InsufficientFundsError';
import { AccountNumber } from '../value-objects/AccountNumber';
import { AccountType } from '../value-objects/AccountType';
import { Balance } from '../value-objects/Balance';
import { Currency } from '../value-objects/Currency';

type AccountProps = {
  id: Id;
  accountNumber: AccountNumber;
  type: AccountType;
  balance: Balance;
  ownerId: Id;
};

export class Account extends BaseEntity {
  public readonly accountNumber: AccountNumber;
  public readonly type: AccountType;
  public readonly balance: Balance;
  public readonly ownerId: Id;

  private constructor(props: AccountProps) {
    super(props.id);
    this.accountNumber = props.accountNumber;
    this.type = props.type;
    this.balance = props.balance;
    this.ownerId = props.ownerId;
  }

  public static create(props: AccountProps) {
    return new Account(props);
  }

  public deposit(amount: Currency): Account {
    try {
      const currentBalance = this.balance.getValue();
      const amountValue = amount.getValue();

      if (amountValue <= 0) {
        throw new Error('Deposit amount must be positive');
      }

      const newBalance = new Balance(currentBalance + amountValue);

      return new Account({
        id: this.id,
        accountNumber: this.accountNumber,
        type: this.type,
        balance: newBalance,
        ownerId: this.ownerId,
      });
    } catch (error) {
      if (error instanceof Error) {
        throw new ValidationError(`Failed to deposit: ${error.message}`);
      }
      throw error;
    }
  }

  public withdraw(amount: Currency): Account {
    try {
      const currentBalance = this.balance.getValue();
      const amountValue = amount.getValue();

      if (amountValue <= 0) {
        throw new Error('Withdrawal amount must be positive');
      }

      if (currentBalance < amountValue) {
        throw new InsufficientFundsError(
          `Cannot withdraw ${amount.toString()} from account with balance ${this.balance.toString()}`,
        );
      }

      const newBalance = new Balance(currentBalance - amountValue);

      return new Account({
        id: this.id,
        accountNumber: this.accountNumber,
        type: this.type,
        balance: newBalance,
        ownerId: this.ownerId,
      });
    } catch (error) {
      if (error instanceof InsufficientFundsError) {
        throw error;
      }

      if (error instanceof Error) {
        throw new ValidationError(`Failed to withdraw: ${error.message}`);
      }

      throw error;
    }
  }
}
