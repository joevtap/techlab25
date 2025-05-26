'use client';

import { AccountCard } from '@/components/AccountCard';
import { Card, CardContent } from '@/components/ui/card';
import type { Account } from '@/types/account';

interface AccountsListProps {
  accounts: Account[];
  selectedAccountId: string;
  onSelectAccount: (accountId: string) => void;
}

export function AccountsList({
  accounts,
  selectedAccountId,
  onSelectAccount,
}: AccountsListProps) {
  if (accounts.length === 0) {
    return (
      <Card>
        <CardContent>
          <p className="text-center text-muted-foreground">
            Nenhuma conta encontrada
          </p>
        </CardContent>
      </Card>
    );
  }

  return (
    <div className="flex flex-col gap-4">
      {accounts.map((account) => (
        <AccountCard
          key={account.id}
          account={account}
          isSelected={selectedAccountId === account.id}
          onSelect={() => onSelectAccount(account.id)}
        />
      ))}
    </div>
  );
}
