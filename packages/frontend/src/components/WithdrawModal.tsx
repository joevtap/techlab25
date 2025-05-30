import {
  Dialog,
  DialogContent,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from './ui/dialog';
import { formatCurrencyInput } from '@/lib/utils';
import { useEffect, useState } from 'react';
import { Button } from './ui/button';
import { Input } from './ui/input';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from './ui/select';
import { useAccounts } from '@/hooks/useAccounts';
import { useForm, type SubmitErrorHandler } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import {
  WithdrawFormSchema,
  type WithdrawFormValues,
} from '@/types/forms/withdrawForm';
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from './ui/form';
import type { Account } from '@/types/account';

type WithdrawModalProps = {
  isOpen: boolean;
  onClose: () => void;
  accounts: Account[];
  selectedAccountId: string;
};

export function WithdrawModal({
  isOpen,
  onClose,
  accounts,
  selectedAccountId,
}: WithdrawModalProps) {
  const { withdrawFromAccount } = useAccounts();
  const selectedAccount = accounts.find(
    (account) => account.id === selectedAccountId,
  );

  const form = useForm<WithdrawFormValues>({
    resolver: zodResolver(WithdrawFormSchema),
    defaultValues: {
      accountNumber: selectedAccount?.number || '',
      amount: undefined,
      description: '',
    },
  });

  const [formattedAmount, setFormattedAmount] = useState('');

  const handleAmountChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { value, formattedValue } = formatCurrencyInput(e.target.value);
    setFormattedAmount(formattedValue);

    form.setValue('amount', value, { shouldValidate: true });
  };

  const handleOnClose = () => {
    form.reset();
    setFormattedAmount('');
    onClose();
  };

  async function onSubmit(data: WithdrawFormValues) {
    const success = await withdrawFromAccount(
      data.accountNumber,
      data.amount,
      data.description,
    );

    if (success) {
      handleOnClose();
    }
  }

  const onInvalid: SubmitErrorHandler<WithdrawFormValues> = (errors) => {
    const errorMessages = [];

    if (errors.accountNumber?.message) {
      errorMessages.push(`Conta: ${errors.accountNumber.message}`);
    }

    if (errors.amount?.message) {
      errorMessages.push(`Valor do saque: ${errors.amount.message}`);
    }

    if (errorMessages.length > 0) {
      console.error('Form validation errors:', errors);
    }
  };

  // Reset account when modal opens if a selectedAccountId is provided
  useEffect(() => {
    if (isOpen && selectedAccountId && selectedAccount) {
      form.setValue('accountNumber', selectedAccount.number, {
        shouldValidate: true,
      });
    }
  }, [isOpen, selectedAccountId, selectedAccount, form]);

  return (
    <Dialog open={isOpen} onOpenChange={(open) => !open && handleOnClose()}>
      <DialogContent className="sm:max-w-[425px]">
        <DialogHeader>
          <DialogTitle>Sacar da conta</DialogTitle>
        </DialogHeader>

        <Form {...form}>
          <form
            onSubmit={form.handleSubmit(onSubmit, onInvalid)}
            className="space-y-4"
          >
            <FormField
              control={form.control}
              name="accountNumber"
              render={({ field }) => (
                <FormItem>
                  <FormLabel htmlFor="account">Conta</FormLabel>
                  <Select
                    onValueChange={field.onChange}
                    defaultValue={field.value}
                  >
                    <FormControl>
                      <SelectTrigger id="account" className="w-full">
                        <SelectValue placeholder="Selecione a conta" />
                      </SelectTrigger>
                    </FormControl>
                    <SelectContent>
                      {accounts.map((account) => (
                        <SelectItem key={account.number} value={account.number}>
                          {account.name} - R${' '}
                          {(account.balance / 100).toFixed(2)}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                  <FormMessage />
                </FormItem>
              )}
            />

            <FormField
              control={form.control}
              name="amount"
              render={() => (
                <FormItem>
                  <FormLabel htmlFor="amount">Valor do saque</FormLabel>
                  <FormControl>
                    <Input
                      id="amount"
                      value={formattedAmount}
                      onChange={handleAmountChange}
                      placeholder="R$ 0,00"
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            <FormField
              control={form.control}
              name="description"
              render={({ field }) => (
                <FormItem>
                  <FormLabel htmlFor="description">
                    Descrição (opcional)
                  </FormLabel>
                  <FormControl>
                    <Input
                      id="description"
                      {...field}
                      placeholder="Adicione uma descrição para esse saque"
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            <DialogFooter className="pt-4">
              <Button
                type="button"
                variant="outline"
                onClick={handleOnClose}
                className="cursor-pointer"
              >
                Cancelar
              </Button>
              <Button type="submit" className="cursor-pointer">
                Sacar
              </Button>
            </DialogFooter>
          </form>
        </Form>
      </DialogContent>
    </Dialog>
  );
}
