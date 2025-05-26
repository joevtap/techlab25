import {
  AccountsContext,
  AccountsDispatchContext,
} from '@/context/Accounts/AccountsContext';
import { useContext } from 'react';
import { useAuthenticatedRequest } from './useAuthenticatedRequest';
import type { Account, Accounts, CreateAccountRequest } from '@/types/account';
import { toast } from 'sonner';
import type { Id } from '@/types/types';

export function useAccounts() {
  const { accounts } = useContext(AccountsContext);
  const dispatch = useContext(AccountsDispatchContext);
  const authFetch = useAuthenticatedRequest();

  const deleteAccount = async (id: Id) => {
    try {
      const res = await authFetch(
        `http://localhost:8080/accounts/delete/${id}`,
        {
          method: 'DELETE',
        },
      );

      if (res.ok) {
        dispatch({ type: 'delete', value: id });
        toast.success('Conta deletada com sucesso!');
        return;
      }
    } catch (error) {
      console.log(error);
      toast.error('Erro ao deletar conta');
    }
  };

  const fetchAccounts = async () => {
    try {
      const res = await authFetch('http://localhost:8080/accounts/all');

      if (res.ok) {
        const { accounts }: Accounts = await res.json();
        dispatch({ type: 'load', value: accounts });
        return;
      }
    } catch (error) {
      console.log(error);
      toast.error('Não foi possível requisitar as contas do usuário');
    }
  };

  const createAccount = async ({
    name,
    balance,
    type,
  }: CreateAccountRequest) => {
    const toastId = toast.loading('Criando conta...');

    try {
      const res = await authFetch('http://localhost:8080/accounts/create', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          name,
          balance,
          type,
        }),
      });

      if (res.ok) {
        const value: Account = await res.json();
        dispatch({ type: 'add', value });
        toast.success(`Conta: ${name}`, {
          description: 'Conta criada com sucesso!',
          id: toastId,
        });
        return;
      }

      toast.error(`Não foi possível criar a conta ${name}`, { id: toastId });
    } catch (error) {
      console.error(error);
      toast.error(`Não foi possível criar a conta ${name}`, { id: toastId });
    }
  };

  return { accounts, createAccount, fetchAccounts, deleteAccount };
}
