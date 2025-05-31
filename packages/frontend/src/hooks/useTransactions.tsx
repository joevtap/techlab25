import {
  TransactionsContext,
  TransactionsDispatchContext,
} from '@/context/Transactions/TransactionsContext';
import { useContext } from 'react';
import { useAuthenticatedRequest } from './useAuthenticatedRequest';
import type { Transactions } from '@/types/transaction';
import { toast } from 'sonner';

export function useTransactions() {
  const { transactions } = useContext(TransactionsContext);
  const dispatch = useContext(TransactionsDispatchContext);
  const authFetch = useAuthenticatedRequest();

  const fetchTransactions = async (
    accountNumber: string,
    from?: Date,
    to?: Date,
  ) => {
    try {
      let url = `${import.meta.env.VITE_API_BASEURL}/transactions/${accountNumber}`;

      const params = new URLSearchParams();

      if (from) {
        params.append('from', from.toISOString());
      }
      if (to) {
        params.append('to', to.toISOString());
      }

      const queryString = params.toString();
      if (queryString) {
        url += `?${queryString}`;
      }

      const res = await authFetch(url);

      if (res.ok) {
        const data: Transactions = await res.json();
        dispatch({ type: 'load', value: data.transactions });
        return data.transactions;
      }

      toast.error('Erro ao buscar transações');
      return [];
    } catch (error) {
      console.error(error);
      toast.error('Erro ao buscar transações');
      return [];
    }
  };

  const clearTransactions = () => {
    dispatch({ type: 'clear' });
  };

  return {
    transactions,
    fetchTransactions,
    clearTransactions,
  };
}
