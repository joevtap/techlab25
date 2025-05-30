import { AccountsContainer } from '@/components/AccountsContainer';
import { Header } from '@/components/Header';
import { TransactionsContainer } from '@/components/TransactionsContainer';
import { Button } from '@/components/ui/button';
import { useAuth } from '@/hooks/useAuth';
import { useModal } from '@/hooks/useModal';
import { PlusCircle } from 'lucide-react';

export function Dashboard() {
  const { session } = useAuth();
  const { openModal } = useModal();

  const handleCreateAccount = () => {
    openModal('CREATE_ACCOUNT');
  };

  return (
    <main className="min-h-svh">
      <Header />
      <div className="container mx-auto px-4 py-6">
        <div className="flex justify-between items-center mb-6">
          <h1 className="text-3xl font-bold">Olá, {session?.user.username}!</h1>
          <Button
            onClick={handleCreateAccount}
            className="flex items-center gap-2 cursor-pointer"
          >
            <PlusCircle className="h-4 w-4" />
            Nova Conta
          </Button>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-4">
          <div className="lg:col-span-1">
            <AccountsContainer />
          </div>
          <div className="lg:col-span-2">
            <TransactionsContainer />
          </div>
        </div>
      </div>
    </main>
  );
}
