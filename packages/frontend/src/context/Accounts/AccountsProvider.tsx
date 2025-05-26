import { useReducer } from 'react';
import { AccountsContext, AccountsDispatchContext } from './AccountsContext';
import type { Account, Accounts } from '@/types/account';
import type { Id } from '@/types/types';

export type AccountsState = Accounts;

export type AccountsAction =
  | { type: 'load'; value: Account[] }
  | { type: 'add'; value: Account }
  | { type: 'delete'; value: Id };

export function AccountsProvider({
  children,
}: {
  children: React.ReactElement;
}) {
  const initialState = { accounts: [] };

  const accountsReducer = (
    state: AccountsState,
    action: AccountsAction,
  ): AccountsState => {
    switch (action.type) {
      case 'load':
        return { accounts: action.value };
      case 'add':
        return { accounts: [...state.accounts, action.value] };
      case 'delete':
        return {
          accounts: state.accounts.filter((account) => {
            return account.id !== action.value;
          }),
        };
      default:
        return initialState;
    }
  };

  const [accounts, dispatch] = useReducer(accountsReducer, initialState);

  return (
    <AccountsContext.Provider value={accounts}>
      <AccountsDispatchContext.Provider value={dispatch}>
        {children}
      </AccountsDispatchContext.Provider>
    </AccountsContext.Provider>
  );
}
