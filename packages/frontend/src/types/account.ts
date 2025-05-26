import type {
  AccountName,
  AccountNumber,
  AccountType,
  Id,
  Money,
} from './types';

export type CreateAccountRequest = {
  name: AccountName;
  balance: Money;
  type: AccountType;
};

export type Account = {
  id: Id;
  name: AccountName;
  number: AccountNumber;
  balance: Money;
  type: AccountType;
  ownerId: Id;
};

export type Accounts = {
  accounts: Account[];
};
