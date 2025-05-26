import { useReducer } from 'react';
import { AccountsContext, AccountsDispatchContext } from './AccountsContext';
import type { Account, Accounts } from '@/types/account';

export type AccountsState = Accounts;

export type AccountsAction =
  | { type: 'add'; value: Account }
  | { type: 'load'; value: Account[] };

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
