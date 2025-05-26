import { TransactionsList } from '@/components/TransactionsList';
import { PeriodFilter } from '@/components/PeriodFilter';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { useState } from 'react';
import type { Transaction } from './TransactionItem';

// Mock data for transactions
const mockTransactions: Transaction[] = [
  {
    id: '1',
    type: 'TRANSFER',
    description: 'Pagamento de Salário',
    amount: 3500.0,
    date: '2025-05-15T08:30:00',
    sourceAccountNumber: 'Empresa Ltda.',
    targetAccountNumber: '1',
  },
  {
    id: '2',
    type: 'TRANSFER',
    description: 'Pagamento de Aluguel',
    amount: 1200.0,
    date: '2025-05-10T14:45:00',
    sourceAccountNumber: '1',
    targetAccountNumber: 'Imobiliária',
  },
  {
    id: '3',
    type: 'TRANSFER',
    description: 'Supermercado',
    amount: 87.35,
    date: '2025-05-08T18:20:00',
    sourceAccountNumber: '1',
    targetAccountNumber: 'Mercado Central',
  },
  {
    id: '4',
    type: 'TRANSFER',
    description: 'Reembolso',
    amount: 29.99,
    date: '2025-05-05T11:15:00',
    sourceAccountNumber: 'Loja Online',
    targetAccountNumber: '1',
  },
  {
    id: '5',
    type: 'TRANSFER',
    description: 'Conta de Luz',
    amount: 145.5,
    date: '2025-05-03T09:30:00',
    sourceAccountNumber: '1',
    targetAccountNumber: 'Companhia Elétrica',
  },
  {
    id: '6',
    type: 'TRANSFER',
    description: 'Saque no Caixa',
    amount: 100.0,
    date: '2025-05-01T16:45:00',
    sourceAccountNumber: '1',
    targetAccountNumber: 'Dinheiro',
  },
  {
    id: '7',
    type: 'TRANSFER',
    description: 'Pagamento de Juros',
    amount: 12.37,
    date: '2025-04-30T00:00:00',
    sourceAccountNumber: 'Banco',
    targetAccountNumber: '2',
  },
  {
    id: '8',
    type: 'TRANSFER',
    description: 'Transferência para Poupança',
    amount: 500.0,
    date: '2025-04-28T10:15:00',
    sourceAccountNumber: '1',
    targetAccountNumber: '2',
  },
];

export function TransactionsContainer() {
  const [selectedPeriod, setSelectedPeriod] = useState('30days');
  const [selectedAccountId, setSelectedAccountId] = useState('1');
  const [transactions, setTransactions] = useState(mockTransactions);

  // Filter transactions based on selected account and period
  const filteredTransactions = transactions.filter((transaction) => {
    const isForSelectedAccount =
      transaction.targetAccountNumber === selectedAccountId ||
      transaction.sourceAccountNumber === selectedAccountId;

    if (!isForSelectedAccount) return false;

    const transactionDate = new Date(transaction.date);
    const now = new Date();

    switch (selectedPeriod) {
      case '7days': {
        const sevenDaysAgo = new Date(now.setDate(now.getDate() - 7));
        return transactionDate >= sevenDaysAgo;
      }
      case '30days': {
        const thirtyDaysAgo = new Date(now.setDate(now.getDate() - 30));
        return transactionDate >= thirtyDaysAgo;
      }
      case '90days': {
        const ninetyDaysAgo = new Date(now.setDate(now.getDate() - 90));
        return transactionDate >= ninetyDaysAgo;
      }
      case 'year':
        return transactionDate.getFullYear() === new Date().getFullYear();
      case 'all':
      default:
        return true;
    }
  });

  return (
    <Card>
      <CardHeader className="flex flex-row items-center justify-between">
        <CardTitle>Histórico de Transações</CardTitle>
        <PeriodFilter
          selectedPeriod={selectedPeriod}
          onPeriodChange={setSelectedPeriod}
        />
      </CardHeader>
      <CardContent>
        <TransactionsList
          transactions={filteredTransactions}
          selectedAccountId={selectedAccountId}
        />
      </CardContent>
    </Card>
  );
}
