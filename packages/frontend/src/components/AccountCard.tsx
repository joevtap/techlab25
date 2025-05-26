'use client';

import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from '@/components/ui/card';
import { cn } from '@/lib/utils';
import { formatCurrency } from '@/lib/utils';
import type { Account } from '@/types/account';
import { Pencil, Trash } from 'lucide-react';
import { useMemo, useState } from 'react';
import { Button } from './ui/button';
import { useAccounts } from '@/hooks/useAccounts';
import { ConfirmDeletionDialog } from './ConfirmDeletionDialog';

interface AccountCardProps {
  account: Account;
  isSelected: boolean;
  onSelect: () => void;
}

export function AccountCard({
  account,
  isSelected,
  onSelect,
}: AccountCardProps) {
  const { deleteAccount } = useAccounts();
  const [isConfirmDeletionModalOpen, setIsConfirmDeletionModalOpen] =
    useState(false);

  const accountType = useMemo(() => {
    switch (account.type) {
      case 'CHECKING':
        return 'Conta corrente';
      case 'INVESTMENTS':
        return 'Conta de investimentos';
      case 'SAVINGS':
        return 'Conta poupança';
    }
  }, [account.type]);

  return (
    <>
      <ConfirmDeletionDialog
        isOpen={isConfirmDeletionModalOpen}
        onCancel={() => {
          setIsConfirmDeletionModalOpen(false);
        }}
        onConfirm={async () => {
          await deleteAccount(account.id);
        }}
      />
      <Card
        className={cn(
          'cursor-pointer transition-colors group',
          isSelected && 'border-accent bg-accent/10',
        )}
        onClick={onSelect}
      >
        <CardHeader className="flex flex-col gap-1">
          <div className="flex justify-between items-center w-full">
            <CardTitle className="text-base font-medium">
              {account.name}
            </CardTitle>
            <div className="opacity-0 flex items-center gap-2 transition-opacity group-hover:opacity-100 group-hover:pointer-events-auto">
              <Button
                variant="ghost"
                className="cursor-pointer hover:bg-destructive"
                onClick={async (e) => {
                  e.stopPropagation();
                  setIsConfirmDeletionModalOpen(true);
                }}
              >
                <Trash size={18} />
              </Button>
              <Button
                variant="ghost"
                className="cursor-pointer"
                onClick={(e) => {
                  e.stopPropagation();
                }}
              >
                <Pencil size={18} />
              </Button>
            </div>
          </div>
          <CardDescription>{accountType}</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="flex justify-between items-center">
            <div className="text-sm font-medium text-muted-foreground font-mono bg-muted p-1 rounded-md">
              {account.number}
            </div>
            <div className="text-lg font-semibold">
              {formatCurrency(account.balance)}
            </div>
          </div>
        </CardContent>
      </Card>
    </>
  );
}
