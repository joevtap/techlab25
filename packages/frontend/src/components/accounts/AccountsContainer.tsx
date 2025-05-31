import { AccountsList } from '@/components/accounts/AccountsList';
import { OperationButtons } from '@/components/accounts/OperationButtons';
import { TotalBalance } from '@/components/accounts/TotalBalance';
import { useAccounts } from '@/hooks/useAccounts';
import { useSelectedAccount } from '@/hooks/useSelectedAccount';
import { TransferModal } from '@/components/modals/TransferModal';
import { DepositModal } from '@/components/modals/DepositModal';
import { WithdrawModal } from '@/components/modals/WithdrawModal';
import { useEffect, useState } from 'react';
import { ConfirmDeletionModal } from '../modals/ConfirmDeletionModal';
import { UpdateAccountModal } from '../modals/UpdateAccountModal';

export function AccountsContainer() {
  const { accounts, fetchAccounts, deleteAccount } = useAccounts();
  const { selectedAccountId, setSelectedAccountId } = useSelectedAccount();

  const [accountToDelete, setAccountToDelete] = useState<string | null>(null);
  const [isConfirmDeletionModalOpen, setIsConfirmDeletionModalOpen] =
    useState(false);

  const [accountToEdit, setAccountToEdit] = useState<string | null>(null);
  const [isUpdateAccountModalOpen, setIsUpdateAccountModalOpen] =
    useState(false);

  const [isTransferModalOpen, setIsTransferModalOpen] = useState(false);
  const [isDepositModalOpen, setIsDepositModalOpen] = useState(false);
  const [isWithdrawModalOpen, setIsWithdrawModalOpen] = useState(false);

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
        onTransfer={() => setIsTransferModalOpen(true)}
        onDeposit={() => setIsDepositModalOpen(true)}
        onWithdraw={() => setIsWithdrawModalOpen(true)}
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
      )}
    </div>
  );
}
