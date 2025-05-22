import { AccountName, AccountType, Id } from '../entities/types';

export type UpdateAccountRequest = {
  id: Id;
  name: AccountName;
  type: AccountType;
  requestingUserId: Id;
};
