import { AccountsList } from '@/components/AccountsList';
import { OperationButtons } from '@/components/OperationButton';
import { TotalBalance } from '@/components/TotalBalance';
import { useAccounts } from '@/hooks/useAccounts';
// import { TransferModal } from '@/components/TransferModal';
// import { DepositModal } from '@/components/deposit-modal';
// import { WithdrawModal } from '@/components/WithdrawModal';
import { useEffect, useState } from 'react';
import { ConfirmDeletionModal } from './ConfirmDeletionModal';
import { UpdateAccountModal } from './UpdateAccountModal';

export function AccountsContainer() {
  const { accounts, fetchAccounts, deleteAccount } = useAccounts();
  const [selectedAccountId, setSelectedAccountId] = useState('');

  const [accountToDelete, setAccountToDelete] = useState<string | null>(null);
  const [isConfirmDeletionModalOpen, setIsConfirmDeletionModalOpen] =
    useState(false);

  const [accountToEdit, setAccountToEdit] = useState<string | null>(null);
  const [isUpdateAccountModalOpen, setIsUpdateAccountModalOpen] =
    useState(false);

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

  const onDeleteAccount = (accountId: string) => {
    setAccountToDelete(accountId);
    setIsConfirmDeletionModalOpen(true);
  };

  const onConfirmDelete = async () => {
    if (accountToDelete) {
      await deleteAccount(accountToDelete);
      setAccountToDelete(null);
    }
    setIsConfirmDeletionModalOpen(false);
  };

  const onCancelDelete = () => {
    setAccountToDelete(null);
    setIsConfirmDeletionModalOpen(false);
  };

  const handleEditAccount = (accountId: string) => {
    setAccountToEdit(accountId);
    setIsUpdateAccountModalOpen(true);
  };

  const handleCloseUpdateModal = () => {
    setAccountToEdit(null);
    setIsUpdateAccountModalOpen(false);
  };

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
          onDeleteAccount={onDeleteAccount}
          onEditAccount={handleEditAccount}
        />

        {accounts.length > 0 && (
          <>
            <div className="block bg-foreground/10 h-[1px] w-full"></div>
            <TotalBalance balance={totalBalance} />
          </>
        )}
      </div>

      {accounts.length > 0 && (
        <>
          <ConfirmDeletionModal
            isOpen={isConfirmDeletionModalOpen}
            onCancel={onCancelDelete}
            onConfirm={onConfirmDelete}
          />
          <UpdateAccountModal
            isOpen={isUpdateAccountModalOpen}
            onClose={handleCloseUpdateModal}
            accountId={accountToEdit}
          />
          {/* <TransferModal
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
          /> */}
        </>
      )}
    </div>
  );
}
