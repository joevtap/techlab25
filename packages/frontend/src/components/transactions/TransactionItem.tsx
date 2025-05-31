import { ArrowDownLeft, ArrowUpRight } from 'lucide-react';
import { cn } from '@/lib/utils';
import { formatCurrency } from '@/lib/utils';
import type { Transaction } from '@/types/transaction';

type TransactionItemProps = {
  transaction: Transaction;
  selectedAccountId: string | undefined;
};

export function TransactionItem({
  transaction,
  selectedAccountId,
}: TransactionItemProps) {
  const getTransactionIcon = (incoming: boolean) => {
    return incoming ? (
      <ArrowDownLeft className="h-5 w-5 text-success-foreground" />
    ) : (
      <ArrowUpRight className="h-5 w-5 text-error-foreground" />
    );
  };

  const getTransactionColor = (incoming: boolean) => {
    return incoming ? 'bg-success' : 'bg-error';
  };

  const isIncoming = selectedAccountId
    ? transaction.targetAccountNumber === selectedAccountId
    : false;

  return (
    <div className="flex items-center gap-4 py-2">
      <div
        className={cn(
          'flex h-10 w-10 items-center justify-center rounded-full',
          getTransactionColor(isIncoming),
        )}
      >
        {getTransactionIcon(isIncoming)}
      </div>
      <div className="flex-1 space-y-1">
        <p className="font-medium">{transaction.description}</p>
        <p className="text-sm text-muted-foreground">
          {new Date(transaction.date).toLocaleDateString('pt-BR', {
            year: 'numeric',
            month: 'short',
            day: 'numeric',
          })}
        </p>
      </div>
      <div
        className={cn(
          'font-medium',
          isIncoming ? 'text-success-foreground' : 'text-error-foreground',
        )}
      >
        {isIncoming ? '+' : '-'}
        {formatCurrency(transaction.amount)}
      </div>
    </div>
  );
}
