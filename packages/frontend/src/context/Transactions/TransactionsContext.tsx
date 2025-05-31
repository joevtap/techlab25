import type { Transactions } from '@/types/transaction';
import { createContext } from 'react';
import type { TransactionsAction } from './TransactionsProvider';

export const TransactionsContext = createContext<Transactions>({
  transactions: [],
});
export const TransactionsDispatchContext = createContext<
  React.ActionDispatch<[action: TransactionsAction]>
>(() => {});
