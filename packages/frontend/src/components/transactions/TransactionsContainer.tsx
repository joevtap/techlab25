import { TransactionsList } from '@/components/transactions/TransactionsList';
import { PeriodFilter } from '@/components/transactions/PeriodFilter';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { useCallback, useEffect, useState } from 'react';
import { useTransactions } from '@/hooks/useTransactions';
import { useSelectedAccount } from '@/hooks/useSelectedAccount';
import { useAccounts } from '@/hooks/useAccounts';
import { Loader2 } from 'lucide-react';

export function TransactionsContainer() {
  const [selectedPeriod, setSelectedPeriod] = useState('all');
  const [isLoading, setIsLoading] = useState(false);
  const { transactions, fetchTransactions } = useTransactions();
  const { selectedAccountId } = useSelectedAccount();

  const getDateRange = useCallback(
    (periodValue: string): { from?: Date; to?: Date } => {
      const now = new Date();
      const to = new Date(now);
      let from: Date | undefined;

      switch (periodValue) {
        case '7days':
          from = new Date(now);
          from.setDate(now.getDate() - 7);
          break;
        case '30days':
          from = new Date(now);
          from.setDate(now.getDate() - 30);
          break;
        case '90days':
          from = new Date(now);
          from.setDate(now.getDate() - 90);
          break;
        case 'year':
          from = new Date(now.getFullYear(), 0, 1);
          break;
        case 'all':
        default:
          from = undefined;
          break;
      }

      return { from, to };
    },
    [],
  );

  const { accounts } = useAccounts();

  const selectedAccount = selectedAccountId
    ? accounts.find((account) => account.id === selectedAccountId)
    : undefined;

  useEffect(() => {
    const loadTransactions = async () => {
      if (selectedAccountId && selectedAccount?.number) {
        setIsLoading(true);
        try {
          const { from, to } = getDateRange(selectedPeriod);
          await fetchTransactions(selectedAccount.number, from, to);
        } finally {
          setIsLoading(false);
        }
      }
    };

    loadTransactions();

    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [selectedAccountId, selectedAccount, selectedPeriod]);

  return (
    <Card className="h-full">
      <CardHeader className="flex flex-row items-center justify-between">
        <CardTitle>Histórico de Transações</CardTitle>

        <PeriodFilter
          selectedPeriod={selectedPeriod}
          onPeriodChange={setSelectedPeriod}
        />
      </CardHeader>
      <CardContent>
        {isLoading ? (
          <div className="flex h-40 items-center justify-center">
            <Loader2 className="h-8 w-8 animate-spin text-primary" />
          </div>
        ) : selectedAccount?.number ? (
          <TransactionsList
            transactions={transactions}
            selectedAccountId={selectedAccount.number}
          />
        ) : (
          <div className="flex h-40 flex-col items-center justify-center text-center text-muted-foreground">
            <p className="mb-2">
              Selecione uma conta para visualizar as transações
            </p>
          </div>
        )}
      </CardContent>
    </Card>
  );
}
