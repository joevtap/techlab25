import { useReducer } from 'react';
import {
  TransactionsContext,
  TransactionsDispatchContext,
} from './TransactionsContext';
import type { Transaction, Transactions } from '@/types/transaction';

export type TransactionsState = Transactions;

export type TransactionsAction =
  | { type: 'load'; value: Transaction[] }
  | { type: 'clear' };

export function TransactionsProvider({
  children,
}: {
  children: React.ReactElement;
}) {
  const initialState = { transactions: [] };

  const transactionsReducer = (
    _: TransactionsState,
    action: TransactionsAction,
  ): TransactionsState => {
    switch (action.type) {
      case 'load':
        return { transactions: action.value };
      case 'clear':
        return { transactions: [] };
      default:
        return initialState;
    }
  };

  const [transactions, dispatch] = useReducer(
    transactionsReducer,
    initialState,
  );

  return (
    <TransactionsContext.Provider value={transactions}>
      <TransactionsDispatchContext.Provider value={dispatch}>
        {children}
      </TransactionsDispatchContext.Provider>
    </TransactionsContext.Provider>
  );
}
