export type ListTransactionsByAccountDto = {
  accountId: string;
  startDate?: string;
  endDate?: string;
  requestingUserId: string;
};
