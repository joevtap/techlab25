import { BusinessRuleViolationError } from '../errors/BusinessRuleViolationError';

import { BaseEntity } from './Base';
import {
  AccountNumber,
  Id,
  Money,
  TransactionDescription,
  TransactionType,
} from './types';

export interface ITransactionBuilder {
  withId(id: Id): ITransactionBuilder;
  withDate(date: Date): ITransactionBuilder;
  withAmount(amount: Money): ITransactionBuilder;
  withSource(source: AccountNumber): ITransactionBuilder;
  withTarget(target: AccountNumber): ITransactionBuilder;
  withDescription(description: TransactionDescription): ITransactionBuilder;
  build(): Transaction;
}

export class Transaction extends BaseEntity {
  public constructor(
    public readonly id: Id,
    public readonly date: Date = new Date(),
    public readonly amount: Money,
    public readonly type: TransactionType,
    public readonly source?: AccountNumber,
    public readonly target?: AccountNumber,
    public readonly description?: TransactionDescription,
  ) {
    super(id);
  }

  public static newTransfer(): ITransactionBuilder {
    return new TransferBuilder();
  }

  public static newCreditTransaction(): ITransactionBuilder {
    return new CreditBuilder();
  }

  public static newDebitTransaction(): ITransactionBuilder {
    return new DebitBuilder();
  }
}

export class TransferBuilder implements ITransactionBuilder {
  private id!: Id;
  private date: Date = new Date();
  private amount!: Money;
  private source?: AccountNumber;
  private target?: AccountNumber;
  private description?: TransactionDescription;

  public withId(id: Id): ITransactionBuilder {
    this.id = id;
    return this;
  }

  public withDate(date: Date): ITransactionBuilder {
    this.date = date;
    return this;
  }

  public withAmount(amount: Money): ITransactionBuilder {
    this.amount = amount;
    return this;
  }

  public withSource(source: AccountNumber): ITransactionBuilder {
    this.source = source;
    return this;
  }

  public withTarget(target: AccountNumber): ITransactionBuilder {
    this.target = target;
    return this;
  }

  public withDescription(
    description: TransactionDescription,
  ): ITransactionBuilder {
    this.description = description;
    return this;
  }

  public build(): Transaction {
    if (!this.source) {
      throw new BusinessRuleViolationError(
        'Transfer transaction requires a source account',
      );
    }

    if (!this.target) {
      throw new BusinessRuleViolationError(
        'Transfer transaction requires a target account',
      );
    }

    return new Transaction(
      this.id,
      this.date,
      this.amount,
      'TRANSFER',
      this.source,
      this.target,
      this.description,
    );
  }
}

export class CreditBuilder implements ITransactionBuilder {
  private id!: Id;
  private date: Date = new Date();
  private amount!: Money;
  private target?: AccountNumber;
  private description?: TransactionDescription;

  public withId(id: Id): ITransactionBuilder {
    this.id = id;
    return this;
  }

  public withDate(date: Date): ITransactionBuilder {
    this.date = date;
    return this;
  }

  public withAmount(amount: Money): ITransactionBuilder {
    this.amount = amount;
    return this;
  }

  public withTarget(target: AccountNumber): ITransactionBuilder {
    this.target = target;
    return this;
  }

  withSource(): ITransactionBuilder {
    return this;
  }

  public withDescription(
    description: TransactionDescription,
  ): ITransactionBuilder {
    this.description = description;
    return this;
  }

  public build(): Transaction {
    if (!this.target) {
      throw new BusinessRuleViolationError(
        'Credit transaction requires a target account',
      );
    }

    return new Transaction(
      this.id,
      this.date,
      this.amount,
      'CREDIT',
      undefined,
      this.target,
      this.description,
    );
  }
}

export class DebitBuilder implements ITransactionBuilder {
  private id!: Id;
  private date: Date = new Date();
  private amount!: Money;
  private source?: AccountNumber;
  private description?: TransactionDescription;

  public withId(id: Id): ITransactionBuilder {
    this.id = id;
    return this;
  }

  public withDate(date: Date): ITransactionBuilder {
    this.date = date;
    return this;
  }

  public withAmount(amount: Money): ITransactionBuilder {
    this.amount = amount;
    return this;
  }

  public withSource(source: AccountNumber): ITransactionBuilder {
    this.source = source;
    return this;
  }

  withTarget(): ITransactionBuilder {
    return this;
  }

  public withDescription(
    description: TransactionDescription,
  ): ITransactionBuilder {
    this.description = description;
    return this;
  }

  public build(): Transaction {
    if (!this.source) {
      throw new BusinessRuleViolationError(
        'Debit transaction requires a source account',
      );
    }

    return new Transaction(
      this.id,
      this.date,
      this.amount,
      'DEBIT',
      this.source,
      undefined,
      this.description,
    );
  }
}
