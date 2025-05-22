import { AccountNumber, Id, Money } from '../entities/types';

export interface AddFundsResponse {
  id: Id;
  accountNumber: AccountNumber;
  amount: Money;
  newBalance: Money;
}
