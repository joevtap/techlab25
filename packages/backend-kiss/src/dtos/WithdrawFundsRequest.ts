import {
  AccountNumber,
  Id,
  Money,
  TransactionDescription,
} from '../entities/types';

export interface WithdrawFundsRequest {
  requestingUserId: Id;
  accountNumber: AccountNumber;
  amount: Money;
  description?: TransactionDescription;
}
