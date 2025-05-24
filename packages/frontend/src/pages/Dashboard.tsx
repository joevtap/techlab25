import { useState } from 'react';
import { CreateAccountModal } from '@/components/create-account-modal';
import { Button } from '@/components/ui/button';
import { DepositModal } from '@/components/deposit-modal';

function Dashboard() {
  const [accountModalOpen, setAccountModalOpen] = useState(false);
  const [depositModalOpen, setDepositModalOpen] = useState(false);

  return (
    <div className="flex min-h-svh w-full items-center justify-center p-6 md:p-10">
      <div className="w-full max-w-sm">
        <Button
          variant={'default'}
          onClick={() => setAccountModalOpen((prev) => !prev)}
        >
          Toggle account modal
        </Button>
        <CreateAccountModal
          isOpen={accountModalOpen}
          onClose={() => {
            setAccountModalOpen(!accountModalOpen);
          }}
        />

        <Button
          variant={'default'}
          onClick={() => setDepositModalOpen((prev) => !prev)}
        >
          Toggle deposit modal
        </Button>
        <DepositModal
          accounts={[]}
          selectedAccountId="i"
          isOpen={depositModalOpen}
          onClose={() => {
            setDepositModalOpen((prev) => !prev);
          }}
        />
      </div>
    </div>
  );
}

export default Dashboard;
