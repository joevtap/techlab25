'use client';

import { AccountCard } from '@/components/account-card';
import { Card, CardContent } from '@/components/ui/card';

interface Account {
  id: string;
  type: string;
  number: string;
  balance: number;
  currency: string;
}

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
        <CardContent className="py-6">
          <p className="text-center text-muted-foreground">
            Nenhuma conta encontrada
          </p>
        </CardContent>
      </Card>
    );
  }

  return (
    <div className="space-y-3">
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
