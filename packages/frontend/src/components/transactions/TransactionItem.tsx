import { ArrowDownLeft, ArrowUpRight } from 'lucide-react';
import { cn } from '@/lib/utils';
import { formatCurrency } from '@/lib/utils';
import type { Transaction } from '@/types/transaction';

type TransactionItemProps = {
  transaction: Transaction;
  selectedAccountId: string | undefined;
};

const descriptionMap: Record<string, string> = {
  'Transfer funds': 'Transferência',
  'Withdraw funds': 'Saque',
  'Add funds': 'Depósito',
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
      <div className="flex-1 flex flex-col gap-2">
        <div className="flex gap-2 items-center flex-wrap">
          <p className="font-medium">
            {descriptionMap[transaction.description] ?? transaction.description}
          </p>
          <p className="text-sm text-muted-foreground">
            {new Date(transaction.date).toLocaleDateString('pt-BR', {
              year: 'numeric',
              month: 'short',
              day: 'numeric',
            })}
          </p>
        </div>
        <div className="flex gap-2 items-center flex-wrap">
          {transaction.sourceAccountNumber && (
            <p className="text-sm font-medium text-error-foreground font-mono bg-error p-1 rounded-md">
              {transaction.sourceAccountNumber}
            </p>
          )}
          {transaction.targetAccountNumber && (
            <p className="text-sm font-medium text-success-foreground font-mono bg-success p-1 rounded-md">
              {transaction.targetAccountNumber}
            </p>
          )}
        </div>
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
