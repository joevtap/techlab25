export type TransactionTypeEnum = 'DEBIT' | 'CREDIT' | 'TRANSFER';

export class TransactionType {
  private readonly value: TransactionTypeEnum;

  public constructor(value: TransactionTypeEnum) {
    this.value = value;
  }

  public equals(transactionType: TransactionType) {
    return this.value === transactionType.value;
  }

  public toString(): TransactionTypeEnum {
    return this.value;
  }
}
