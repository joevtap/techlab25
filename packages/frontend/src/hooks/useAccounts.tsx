import {
  AccountsContext,
  AccountsDispatchContext,
} from '@/context/Accounts/AccountsContext';
import { useContext } from 'react';
import { useAuthenticatedRequest } from './useAuthenticatedRequest';
import type {
  Account,
  Accounts,
  CreateAccountRequest,
  UpdateAccountRequest,
} from '@/types/account';
import { toast } from 'sonner';
import type { Id } from '@/types/types';

export function useAccounts() {
  const { accounts } = useContext(AccountsContext);
  const dispatch = useContext(AccountsDispatchContext);
  const authFetch = useAuthenticatedRequest();

  const updateAccount = async ({ id, name, type }: UpdateAccountRequest) => {
    try {
      const res = await authFetch(
        `${import.meta.env.VITE_API_BASEURL}/accounts/update/${id}`,
        {
          method: 'PATCH',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify({
            name,
            type,
          }),
        },
      );

      if (res.ok) {
        const value: Account = await res.json();
        dispatch({ type: 'update', value });
        toast.success('Conta atualizada com sucesso!');
        return;
      }
    } catch (error) {
      console.error(error);
      toast.error('Erro ao atualizar conta');
    }
  };

  const deleteAccount = async (id: Id) => {
    try {
      const res = await authFetch(
        `${import.meta.env.VITE_API_BASEURL}/accounts/delete/${id}`,
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
      console.error(error);
      toast.error('Erro ao deletar conta');
    }
  };

  const fetchAccounts = async () => {
    try {
      const res = await authFetch(
        `${import.meta.env.VITE_API_BASEURL}/accounts/all`,
      );

      if (res.ok) {
        const { accounts }: Accounts = await res.json();
        dispatch({ type: 'load', value: accounts });
        return;
      }
    } catch (error) {
      console.error(error);
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
      const res = await authFetch(
        `${import.meta.env.VITE_API_BASEURL}/accounts/create`,
        {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify({
            name,
            balance,
            type,
          }),
        },
      );

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

  const transferBetweenAccounts = async (
    sourceAccountNumber: string,
    targetAccountNumber: string,
    amount: number,
    description?: string,
  ) => {
    const toastId = toast.loading('Realizando transferência...');

    try {
      const res = await authFetch(
        `${import.meta.env.VITE_API_BASEURL}/transactions/transfer`,
        {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify({
            sourceAccountNumber,
            targetAccountNumber,
            amount,
            description,
          }),
        },
      );

      if (res.ok) {
        await fetchAccounts();
        toast.success('Transferência realizada com sucesso!', { id: toastId });
        return true;
      }

      toast.error('Não foi possível realizar a transferência', { id: toastId });
      return false;
    } catch (error) {
      console.error(error);
      toast.error('Erro ao realizar transferência', { id: toastId });
      return false;
    }
  };

  const depositToAccount = async (
    accountNumber: string,
    amount: number,
    description?: string,
  ) => {
    const toastId = toast.loading('Realizando depósito...');

    try {
      const res = await authFetch(
        `${import.meta.env.VITE_API_BASEURL}/transactions/deposit`,
        {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify({
            accountNumber,
            amount,
            description,
          }),
        },
      );

      if (res.ok) {
        await fetchAccounts();
        toast.success(
          `Depósito de R$ ${(amount / 100).toFixed(2)} realizado com sucesso!`,
          { id: toastId },
        );
        return true;
      }

      toast.error('Não foi possível realizar o depósito', { id: toastId });
      return false;
    } catch (error) {
      console.error(error);
      toast.error('Erro ao realizar depósito', { id: toastId });
      return false;
    }
  };

  const withdrawFromAccount = async (
    accountNumber: string,
    amount: number,
    description?: string,
  ) => {
    const toastId = toast.loading('Realizando saque...');

    try {
      const res = await authFetch(
        `${import.meta.env.VITE_API_BASEURL}/transactions/withdraw`,
        {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify({
            accountNumber,
            amount,
            description,
          }),
        },
      );

      if (res.ok) {
        await fetchAccounts();
        toast.success(
          `Saque de R$ ${(amount / 100).toFixed(2)} realizado com sucesso!`,
          { id: toastId },
        );
        return true;
      }

      toast.error('Não foi possível realizar o saque', { id: toastId });
      return false;
    } catch (error) {
      console.error(error);
      toast.error('Erro ao realizar saque', { id: toastId });
      return false;
    }
  };

  return {
    accounts,
    createAccount,
    fetchAccounts,
    deleteAccount,
    updateAccount,
    transferBetweenAccounts,
    depositToAccount,
    withdrawFromAccount,
  };
}
