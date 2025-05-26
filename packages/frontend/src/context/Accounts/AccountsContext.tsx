import type { Accounts } from '@/types/account';
import { createContext } from 'react';
import type { AccountsAction } from './AccountsProvider';

export const AccountsContext = createContext<Accounts>({ accounts: [] });
export const AccountsDispatchContext = createContext<
  React.ActionDispatch<[action: AccountsAction]>
>(() => {});
