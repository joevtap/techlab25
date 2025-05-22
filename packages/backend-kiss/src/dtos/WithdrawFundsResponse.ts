import { AccountNumber, Id, Money } from '../entities/types';

export interface WithdrawFundsResponse {
  id: Id;
  accountNumber: AccountNumber;
  amount: Money;
  newBalance: Money;
}
