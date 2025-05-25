import { AccountsList } from '@/components/accounts-list';
import { OperationButtons } from '@/components/operation-buttons';
import { TotalBalance } from '@/components/total-balance';
// import { TransferModal } from '@/components/TransferModal';
// import { DepositModal } from '@/components/deposit-modal';
// import { WithdrawModal } from '@/components/WithdrawModal';
import { useState, useEffect } from 'react';

interface Account {
  id: string;
  type: string;
  number: string;
  balance: number;
  currency: string;
}

export function AccountsContainer() {
  const [accounts, setAccounts] = useState<Account[]>([]);
  const [selectedAccountId, setSelectedAccountId] = useState('');
  const [isTransferModalOpen, setIsTransferModalOpen] = useState(false);
  const [isDepositModalOpen, setIsDepositModalOpen] = useState(false);
  const [isWithdrawModalOpen, setIsWithdrawModalOpen] = useState(false);

  useEffect(() => {
    // Load accounts from localStorage
    const accountsJSON = localStorage.getItem('userAccounts');
    if (accountsJSON) {
      const loadedAccounts = JSON.parse(accountsJSON);
      setAccounts(loadedAccounts);

      // Set the first account as selected by default
      if (loadedAccounts.length > 0 && !selectedAccountId) {
        setSelectedAccountId(loadedAccounts[0].id);
      }
    }
  }, [selectedAccountId]);

  const totalBalance = accounts.reduce(
    (sum, account) => sum + account.balance,
    0,
  );

  return (
    <div className="space-y-4">
      <OperationButtons
        onTransfer={() => setIsTransferModalOpen(true)}
        onDeposit={() => setIsDepositModalOpen(true)}
        onWithdraw={() => setIsWithdrawModalOpen(true)}
        disabled={accounts.length < 1}
      />

      <AccountsList
        accounts={accounts}
        selectedAccountId={selectedAccountId}
        onSelectAccount={setSelectedAccountId}
      />

      {accounts.length > 0 && <TotalBalance balance={totalBalance} />}

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
