import {
  AccountNumber,
  Id,
  Money,
  TransactionDescription,
} from '../entities/types';

export interface AddFundsRequest {
  requestingUserId: Id;
  accountNumber: AccountNumber;
  amount: Money;
  description?: TransactionDescription;
}
