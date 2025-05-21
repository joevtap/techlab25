export type TransactionDto = {
  id: string;
  type: string;
  fromAccountId?: string;
  toAccountId?: string;
  amount: number;
  description?: string;
  createdAt: string;
};

export type ListTransactionsResponseDto = {
  transactions: TransactionDto[];
};
