import { AccountNumber, Id, Money } from '../entities/types';

export type AddFundsResponse = {
  id: Id;
  accountNumber: AccountNumber;
  amount: Money;
  newBalance: Money;
};
