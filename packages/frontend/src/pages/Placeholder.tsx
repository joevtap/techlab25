import { CreateAccountModal } from '@/components/create-account-modal';
import { TransactionsContainer } from '@/components/transactions-container';
import { Button } from '@/components/ui/button';
import { PlusCircle } from 'lucide-react';
import { useState } from 'react';

export function DashboardContainer() {
  const [isCreateAccountModalOpen, setIsCreateAccountModalOpen] =
    useState(false);

  // const [hasAccounts, setHasAccounts] = useState(true);

  return (
    <main className="min-h-screen ">
      {/* <Header /> */}
      <div className="container mx-auto px-4 py-6">
        <div className="flex justify-between items-center mb-6">
          <h1 className="text-3xl font-bold">Minhas Contas</h1>
          <Button
            onClick={() => setIsCreateAccountModalOpen(true)}
            className="flex items-center gap-2"
          >
            <PlusCircle className="h-4 w-4" />
            Nova Conta
          </Button>
        </div>

        {/* {hasAccounts ? ( */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          <div className="lg:col-span-1 bg-slate-900">
            {/* <AccountsContainer /> */}
          </div>
          <div className="lg:col-span-2">
            <TransactionsContainer />
          </div>
        </div>

        {/* ) : (
          <EmptyState
            title="Você ainda não possui contas"
            description="Crie sua primeira conta para começar"
            actionLabel="Criar Conta"
            onAction={() => setIsCreateAccountModalOpen(true)}
            icon={<PlusCircle className="h-4 w-4" />}
          />
        )} */}
      </div>

      <CreateAccountModal
        isOpen={isCreateAccountModalOpen}
        onClose={() => setIsCreateAccountModalOpen(false)}
      />
    </main>
  );
}
