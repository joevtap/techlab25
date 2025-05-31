import { TransactionItem } from '@/components/transactions/TransactionItem';
import type { Transaction } from '@/types/transaction';

interface TransactionsListProps {
  transactions: Transaction[];
  selectedAccountId: string | undefined;
}

export function TransactionsList({
  transactions,
  selectedAccountId,
}: TransactionsListProps) {
  if (transactions.length === 0) {
    return (
      <div className="py-8 text-center text-muted-foreground">
        Nenhuma transação encontrada para este período
      </div>
    );
  }

  return (
    <div className="space-y-4">
      {transactions.map((transaction) => (
        <TransactionItem
          key={transaction.id}
          transaction={transaction}
          selectedAccountId={selectedAccountId}
        />
      ))}
    </div>
  );
}
