import { Id, Money } from '../entities/types';

export type TransferFundsResponse = {
  id: Id;
  sourceAccountNumber: string;
  targetAccountNumber: string;
  amount: Money;
};
