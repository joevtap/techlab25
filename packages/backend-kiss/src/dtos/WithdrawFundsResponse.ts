import { AccountNumber, Id, Money } from '../entities/types';

export type WithdrawFundsResponse = {
  id: Id;
  accountNumber: AccountNumber;
  amount: Money;
  newBalance: Money;
};
