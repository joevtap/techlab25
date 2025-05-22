import { Id, Money } from '../entities/types';

export interface TransferFundsResponse {
  id: Id;
  sourceAccountNumber: string;
  targetAccountNumber: string;
  amount: Money;
}
