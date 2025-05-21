import { BaseEntity } from './Base';
import { AccountNumber, Id, Money, TransactionDescription } from './types';

export class Transaction extends BaseEntity {
  public constructor(
    public readonly id: Id,
    public readonly type: string,
    public readonly amount: Money,
    public readonly createdAt: Date,
    public readonly source?: AccountNumber,
    public readonly target?: AccountNumber,
    public readonly description?: TransactionDescription,
  ) {
    super(id);
  }
}
