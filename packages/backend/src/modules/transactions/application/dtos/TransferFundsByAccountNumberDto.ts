export type TransferFundsByAccountNumberDto = {
  sourceAccountNumber: string;
  targetAccountNumber: string;
  amount: number;
  description?: string;
  requestingUserId: string;
};
