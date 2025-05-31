import { AccountCard } from '@/components/accounts/AccountCard';
import { Card, CardContent } from '@/components/ui/card';
import type { Account } from '@/types/account';

interface AccountsListProps {
  accounts: Account[];
  selectedAccountId: string;
  onSelectAccount: (accountId: string) => void;
  onDeleteAccount: (accountId: string) => void;
  onEditAccount: (accountId: string) => void;
}

export function AccountsList({
  accounts,
  selectedAccountId,
  onSelectAccount,
  onDeleteAccount,
  onEditAccount,
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
    <div className="flex flex-col gap-4 h-max">
      {accounts.map((account) => (
        <AccountCard
          key={account.id}
          account={account}
          isSelected={selectedAccountId === account.id}
          onSelect={() => onSelectAccount(account.id)}
          onDelete={() => onDeleteAccount(account.id)}
          onEdit={onEditAccount}
        />
      ))}
    </div>
  );
}
