import { BaseEntity } from '../../../../core/domain/entities';
import { Id } from '../../../../core/domain/value-objects';
import { AccountNumber } from '../value-objects/AccountNumber';
import { Description } from '../value-objects/Description';
import { TransactionDate } from '../value-objects/TransactionDate';
import { TransactionType } from '../value-objects/TransactionType';
import { TransactionValue } from '../value-objects/TransactionValue';

type TransactionProps = {
  id: Id;
  type: TransactionType;
  fromAccountNumber?: AccountNumber;
  fromId?: Id;
  toAccountNumber?: AccountNumber;
  toId?: Id;
  value: TransactionValue;
  description?: Description;
  createdAt: TransactionDate;
};

type TransferProps = Omit<
  TransactionProps,
  'type' | 'description' | 'fromId' | 'toId'
> & {
  fromId: Id;
  toId: Id;
  description?: Description;
};

type DebitProps = Omit<
  TransactionProps,
  'type' | 'toId' | 'toAccountNumber'
> & {
  fromId: Id;
};

type CreditProps = Omit<
  TransactionProps,
  'type' | 'fromId' | 'fromAccountNumber'
> & {
  toId: Id;
};

export class Transaction extends BaseEntity {
  public readonly type: TransactionType;
  public readonly fromId?: Id;
  public readonly fromAccountNumber?: AccountNumber;
  public readonly toId?: Id;
  public readonly toAccountNumber?: AccountNumber;
  public readonly value: TransactionValue;
  public readonly description?: Description;
  public readonly createdAt: TransactionDate;

  private constructor(props: TransactionProps) {
    super(props.id);
    this.type = props.type;
    this.fromId = props.fromId;
    this.fromAccountNumber = props.fromAccountNumber;
    this.toId = props.toId;
    this.toAccountNumber = props.toAccountNumber;
    this.value = props.value;
    this.description = props.description;
    this.createdAt = props.createdAt;
  }

  public static transfer(props: TransferProps): Transaction {
    return new Transaction({
      ...props,
      type: new TransactionType('TRANSFER'),
    });
  }

  public static debit(props: DebitProps): Transaction {
    return new Transaction({
      ...props,
      type: new TransactionType('DEBIT'),
      toId: undefined,
    });
  }

  public static credit(props: CreditProps): Transaction {
    return new Transaction({
      ...props,
      type: new TransactionType('CREDIT'),
      fromId: undefined,
    });
  }

  public isTransfer(): boolean {
    return this.type.equals(new TransactionType('TRANSFER'));
  }

  public isDebit(): boolean {
    return this.type.equals(new TransactionType('DEBIT'));
  }

  public isCredit(): boolean {
    return this.type.equals(new TransactionType('CREDIT'));
  }
}
