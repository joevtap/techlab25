export type TransactionDto = {
  id: string;
  type: string;
  fromAccountId?: string;
  fromAccountNumber?: string;
  toAccountId?: string;
  toAccountNumber?: string;
  amount: number;
  description?: string;
  createdAt: string;
};

export type ListTransactionsResponseDto = {
  transactions: TransactionDto[];
};
