export type Id = string;

export type Email = string;
export type Username = string;
export type Password = string;

export type Money = number;
export type AccountNumber = string;
export type AccountType = 'CHECKING' | 'SAVINGS' | 'INVESTMENTS';
export const AccountTypeArray: AccountType[] = [
  'CHECKING',
  'SAVINGS',
  'INVESTMENTS',
];

export type TransactionDescription = string;
