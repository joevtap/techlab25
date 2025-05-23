export type WithdrawFundsDto = {
  accountId: string;
  amount: number;
  description?: string;
  requestingUserId: string;
};
