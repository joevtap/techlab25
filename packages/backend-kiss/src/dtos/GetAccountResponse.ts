import {
  Id,
  AccountName,
  AccountNumber,
  AccountType,
  Money,
} from '../entities/types';

export type GetAccountResponse = {
  id: Id;
  name: AccountName;
  number: AccountNumber;
  type: AccountType;
  balance: Money;
  ownerId: Id;
};
