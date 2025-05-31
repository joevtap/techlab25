import { createContext, useState, type ReactNode } from 'react';
import type { AccountNumber } from '@/types/types';

type SelectedAccountContextType = {
  selectedAccountId: AccountNumber | undefined;
  setSelectedAccountId: (id: AccountNumber | undefined) => void;
};

export const SelectedAccountContext = createContext<SelectedAccountContextType>(
  {
    selectedAccountId: undefined,
    setSelectedAccountId: () => {},
  },
);

type SelectedAccountProviderProps = {
  children: ReactNode;
};

export function SelectedAccountProvider({
  children,
}: SelectedAccountProviderProps) {
  const [selectedAccountId, setSelectedAccountId] = useState<
    AccountNumber | undefined
  >(undefined);

  return (
    <SelectedAccountContext.Provider
      value={{ selectedAccountId, setSelectedAccountId }}
    >
      {children}
    </SelectedAccountContext.Provider>
  );
}
