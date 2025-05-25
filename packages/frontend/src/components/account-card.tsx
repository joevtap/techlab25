'use client';

import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { cn } from '@/lib/utils';
import { formatCurrency } from '@/lib/utils';

interface Account {
  id: string;
  type: string;
  number: string;
  balance: number;
  currency: string;
}

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
  return (
    <Card
      className={cn(
        'cursor-pointer transition-colors hover:bg-gray-50',
        isSelected && 'border-primary bg-primary/5',
      )}
      onClick={onSelect}
    >
      <CardHeader className="py-4 px-5">
        <CardTitle className="text-base font-medium">{account.type}</CardTitle>
      </CardHeader>
      <CardContent className="py-2 px-5">
        <div className="flex justify-between items-center">
          <div className="text-sm text-muted-foreground">{account.number}</div>
          <div className="text-lg font-semibold">
            {formatCurrency(account.balance)}
          </div>
        </div>
      </CardContent>
    </Card>
  );
}
