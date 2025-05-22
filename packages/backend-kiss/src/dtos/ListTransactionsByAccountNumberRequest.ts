import { AccountNumber, Id } from '../entities/types';

export interface ListTransactionsByAccountNumberRequest {
  requestingUserId: Id;
  accountNumber: AccountNumber;
  from?: Date;
  to?: Date;
}
