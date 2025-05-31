import type { AccountNumber } from './types';

export type TransactionType = 'DEBIT' | 'CREDIT' | 'TRANSFER';

export type Transaction = {
  id: string;
  type: TransactionType;
  description: string;
  amount: number;
  date: string;
  sourceAccountNumber?: string;
  targetAccountNumber?: string;
};

export type Transactions = {
  transactions: Transaction[];
};

export type ListTransactionsRequest = {
  accountNumber: AccountNumber;
  from?: Date;
  to?: Date;
};
