export type TransferFundsByAccountNumberExternalDto = {
  sourceAccountNumber: string;
  targetAccountNumber: string;
  amount: number;
  description?: string;
};
