export type AddFundsDto = {
  accountId: string;
  amount: number;
  description?: string;
  requestingUserId: string;
};
