'use client';

import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from '@/components/ui/card';
import { cn } from '@/lib/utils';
import { formatCurrency } from '@/lib/utils';
import type { Account } from '@/types/account';
import { useMemo } from 'react';

interface AccountCardProps {
  account: Account;
  isSelected: boolean;
  onSelect: () => void;
}

export function AccountCard({
  account,
  isSelected,
  onSelect,
}: AccountCardProps) {
  const accountType = useMemo(() => {
    switch (account.type) {
      case 'CHECKING':
        return 'Conta corrente';
      case 'INVESTMENTS':
        return 'Conta de investimentos';
      case 'SAVINGS':
        return 'Conta poupança';
    }
  }, [account.type]);

  return (
    <Card
      className={cn(
        'cursor-pointer transition-colors',
        isSelected && 'border-accent bg-accent/10',
      )}
      onClick={onSelect}
    >
      <CardHeader className="flex flex-col gap-1">
        <CardTitle className="text-base font-medium">{account.name}</CardTitle>
        <CardDescription>{accountType}</CardDescription>
      </CardHeader>
      <CardContent>
        <div className="flex justify-between items-center">
          <div className="text-sm font-medium text-muted-foreground font-mono bg-muted p-1 rounded-md">
            {account.number}
          </div>
          <div className="text-lg font-semibold">
            {formatCurrency(account.balance)}
          </div>
        </div>
      </CardContent>
    </Card>
  );
}
