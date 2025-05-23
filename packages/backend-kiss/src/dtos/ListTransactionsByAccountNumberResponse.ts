import {
  AccountNumber,
  Id,
  Money,
  TransactionDescription,
  TransactionType,
} from '../entities/types';

export type TransactionDto = {
  id: Id;
  type: TransactionType;
  amount: Money;
  date: Date;
  sourceAccountNumber?: AccountNumber;
  targetAccountNumber?: AccountNumber;
  description?: TransactionDescription;
};

export type ListTransactionsByAccountNumberResponse = {
  transactions: TransactionDto[];
};
