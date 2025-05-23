import { Id } from '../../../../core/domain/value-objects';
import { Transaction } from '../entities/Transaction';
import { TransactionDate } from '../value-objects/TransactionDate';

export interface ITransactionRepository {
  save(transaction: Transaction, transactionId?: symbol): Promise<void>;
  listByAccountId(id: Id, transactionId?: symbol): Promise<Transaction[]>;
  listByAccountIdAndPeriod(
    id: Id,
    from: TransactionDate,
    to: TransactionDate,
    transactionId?: symbol,
  ): Promise<Transaction[]>;
}
