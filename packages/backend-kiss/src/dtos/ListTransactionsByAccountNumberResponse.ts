import {
  AccountNumber,
  Id,
  Money,
  TransactionDescription,
  TransactionType,
} from '../entities/types';

export interface TransactionDto {
  id: Id;
  type: TransactionType;
  amount: Money;
  date: Date;
  sourceAccountNumber?: AccountNumber;
  targetAccountNumber?: AccountNumber;
  description?: TransactionDescription;
}

export interface ListTransactionsByAccountNumberResponse {
  transactions: TransactionDto[];
}
