/* eslint-disable @typescript-eslint/no-unused-vars */
import { Id } from '../../core/domain/value-objects';
import { Transaction } from '../../modules/transactions/domain/entities/Transaction';
import { ITransactionRepository } from '../../modules/transactions/domain/repositories/ITransactionRepository';
import { TransactionDate } from '../../modules/transactions/domain/value-objects/TransactionDate';

// This mock implementation ignores the transactionId parameter
export class MockTransactionRepository implements ITransactionRepository {
  public transactions: Transaction[] = [];

  async save(transaction: Transaction, transactionId?: symbol): Promise<void> {
    const existingTransactionIndex = this.transactions.findIndex((t) =>
      t.id.equals(transaction.id),
    );

    if (existingTransactionIndex >= 0) {
      this.transactions[existingTransactionIndex] = transaction;
    } else {
      this.transactions.push(transaction);
    }
  }

  async listByAccountId(
    id: Id,
    transactionId?: symbol,
  ): Promise<Transaction[]> {
    return this.transactions.filter(
      (t) => (t.fromId && t.fromId.equals(id)) || (t.toId && t.toId.equals(id)),
    );
  }

  async listByAccountIdAndPeriod(
    id: Id,
    from: TransactionDate,
    to: TransactionDate,
    transactionId?: symbol,
  ): Promise<Transaction[]> {
    return this.transactions.filter((t) => {
      const isAccountMatch =
        (t.fromId && t.fromId.equals(id)) || (t.toId && t.toId.equals(id));

      if (!isAccountMatch) return false;

      const date = t.createdAt.getValue();
      return date >= from.getValue() && date <= to.getValue();
    });
  }

  public clear(): void {
    this.transactions = [];
  }
}
