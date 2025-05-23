export type TransferFundsExternalDto = {
  sourceAccountId: string;
  targetAccountId: string;
  amount: number;
  description?: string;
};
