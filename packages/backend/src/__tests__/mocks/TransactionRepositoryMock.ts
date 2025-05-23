import { Transaction } from '../../entities/Transaction';
import { AccountNumber } from '../../entities/types';
import { ITransactionRepository } from '../../repositories/ITransactionRespository';

export class TransactionRepositoryMock implements ITransactionRepository {
  private transactions: Map<string, Transaction> = new Map();
  private accountTransactions: Map<AccountNumber, Transaction[]> = new Map();

  async add(entity: Transaction): Promise<Transaction> {
    this.transactions.set(entity.id, entity);

    if (entity.source) {
      const sourceTransactions =
        this.accountTransactions.get(entity.source) || [];
      sourceTransactions.push(entity);
      this.accountTransactions.set(entity.source, sourceTransactions);
    }

    if (entity.target) {
      const targetTransactions =
        this.accountTransactions.get(entity.target) || [];
      targetTransactions.push(entity);
      this.accountTransactions.set(entity.target, targetTransactions);
    }

    return entity;
  }

  async findAllByAccountNumber(
    accountNumber: AccountNumber,
    from?: Date,
    to?: Date,
  ): Promise<Transaction[]> {
    const transactions = this.accountTransactions.get(accountNumber) || [];

    if (!from && !to) {
      return transactions;
    }

    return transactions.filter((transaction) => {
      if (from && transaction.date < from) {
        return false;
      }

      if (to && transaction.date > to) {
        return false;
      }

      return true;
    });
  }

  reset(): void {
    this.transactions.clear();
    this.accountTransactions.clear();
  }
}
