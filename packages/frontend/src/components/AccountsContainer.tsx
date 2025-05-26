import { AccountsList } from '@/components/AccountsList';
import { OperationButtons } from '@/components/operation-buttons';
import { TotalBalance } from '@/components/total-balance';
import { useAccounts } from '@/hooks/useAccounts';
// import { TransferModal } from '@/components/TransferModal';
// import { DepositModal } from '@/components/deposit-modal';
// import { WithdrawModal } from '@/components/WithdrawModal';
import { useEffect, useState } from 'react';

export function AccountsContainer() {
  const { accounts, fetchAccounts } = useAccounts();
  const [selectedAccountId, setSelectedAccountId] = useState('');
  // const [isTransferModalOpen, setIsTransferModalOpen] = useState(false);
  // const [isDepositModalOpen, setIsDepositModalOpen] = useState(false);
  // const [isWithdrawModalOpen, setIsWithdrawModalOpen] = useState(false);

  useEffect(() => {
    fetchAccounts();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const totalBalance = accounts.reduce(
    (sum, account) => sum + account.balance,
    0,
  );

  return (
    <div className="flex flex-col gap-4">
      <OperationButtons
        onTransfer={() => {}}
        onDeposit={() => {}}
        onWithdraw={() => {}}
        disabled={accounts.length < 1}
      />
      <div className="flex flex-col gap-4">
        <AccountsList
          accounts={accounts}
          selectedAccountId={selectedAccountId}
          onSelectAccount={setSelectedAccountId}
        />

        <div className="block bg-foreground/10 h-[1px] w-full"></div>

        {accounts.length > 0 && <TotalBalance balance={totalBalance} />}
      </div>

      {/* Modals */}
      {/* {accounts.length > 0 && (
        <>
          <TransferModal
            isOpen={isTransferModalOpen}
            onClose={() => setIsTransferModalOpen(false)}
            accounts={accounts}
            selectedAccountId={selectedAccountId}
          />

          <DepositModal
            isOpen={isDepositModalOpen}
            onClose={() => setIsDepositModalOpen(false)}
            accounts={accounts}
            selectedAccountId={selectedAccountId}
          />

          <WithdrawModal
            isOpen={isWithdrawModalOpen}
            onClose={() => setIsWithdrawModalOpen(false)}
            accounts={accounts}
            selectedAccountId={selectedAccountId}
          />
        </>
      )} */}
    </div>
  );
}
