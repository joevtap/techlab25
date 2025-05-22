import { AccountName, Money, AccountType, Id } from '../entities/types';

export type CreateAccountRequest = {
  name: AccountName;
  balance: Money;
  type: AccountType;
  ownerId: Id;
  requestingUserId: Id;
};
