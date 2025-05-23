export type TransferFundsDto = {
  sourceAccountId: string;
  targetAccountId: string;
  amount: number;
  description?: string;
  requestingUserId: string;
};
