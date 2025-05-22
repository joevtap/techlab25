export type Id = string;
export type Token = string;

export type Email = string;
export type Username = string;
export type Password = string;

export type Money = number;
export type AccountName = string;
export type AccountNumber = string;
export type AccountType = 'CHECKING' | 'SAVINGS' | 'INVESTMENTS';
export const AccountTypeArray: AccountType[] = [
  'CHECKING',
  'SAVINGS',
  'INVESTMENTS',
];

export type TransactionDescription = string;
export type TransactionType = 'DEBIT' | 'CREDIT' | 'TRANSFER';
export const TransactionTypeArray: TransactionType[] = [
  'DEBIT',
  'CREDIT',
  'TRANSFER',
];
