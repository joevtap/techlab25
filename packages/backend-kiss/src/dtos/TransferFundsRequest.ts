import {
  AccountNumber,
  Id,
  Money,
  TransactionDescription,
} from '../entities/types';

export interface TransferFundsRequest {
  requestingUserId: Id;
  sourceAccountNumber: AccountNumber;
  targetAccountNumber: AccountNumber;
  amount: Money;
  description?: TransactionDescription;
}
