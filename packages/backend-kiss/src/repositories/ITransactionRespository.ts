import { Transaction } from '../entities/Transaction';
import { AccountNumber } from '../entities/types';

export interface ITransactionRepository {
  add(entity: Transaction): Promise<Transaction>;
  findAllByAccountNumber(
    accountNumber: AccountNumber,
    from?: Date,
    to?: Date,
  ): Promise<Transaction[]>;
}
