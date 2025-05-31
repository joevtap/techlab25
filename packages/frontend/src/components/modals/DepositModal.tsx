import { toast } from 'sonner';
import {
  Dialog,
  DialogContent,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from '../ui/dialog';
import { formatCurrency, formatCurrencyInput } from '@/lib/utils';
import { useEffect, useState } from 'react';
import { Button } from '../ui/button';
import { Input } from '../ui/input';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '../ui/select';
import { useAccounts } from '@/hooks/useAccounts';
import { useForm, type SubmitErrorHandler } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import {
  DepositFormSchema,
  type DepositFormValues,
} from '@/types/forms/depositForm';
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from '../ui/form';
import type { Account } from '@/types/account';

type DepositModalProps = {
  isOpen: boolean;
  onClose: () => void;
  accounts: Account[];
  selectedAccountId: string;
};

export function DepositModal({
  isOpen,
  onClose,
  accounts,
  selectedAccountId,
}: DepositModalProps) {
  const { depositToAccount } = useAccounts();
  const selectedAccount = accounts.find(
    (account) => account.id === selectedAccountId,
  );

  const form = useForm<DepositFormValues>({
    resolver: zodResolver(DepositFormSchema),
    defaultValues: {
      accountNumber: selectedAccount?.number || '',
      amount: undefined,
      description: '',
    },
  });

  const [formattedAmount, setFormattedAmount] = useState('');
  const [isLoading, setIsLoading] = useState(false);

  useEffect(() => {
    if (isOpen && selectedAccountId && selectedAccount) {
      form.setValue('accountNumber', selectedAccount.number, {
        shouldValidate: true,
      });
    }
  }, [isOpen, selectedAccountId, selectedAccount, form]);

  const handleAmountChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { value, formattedValue } = formatCurrencyInput(e.target.value);
    setFormattedAmount(formattedValue);
    form.setValue('amount', value, { shouldValidate: true });
  };

  const handleOnClose = () => {
    form.reset();
    setFormattedAmount('');
    setIsLoading(false);
    onClose();
  };

  async function onSubmit(data: DepositFormValues) {
    setIsLoading(true);
    try {
      const success = await depositToAccount(
        data.accountNumber,
        data.amount,
        data.description,
      );

      if (success) {
        handleOnClose();
      }
    } catch (error) {
      console.error(error);
      toast.error('Erro ao processar o depósito');
    } finally {
      setIsLoading(false);
    }
  }

  const onInvalid: SubmitErrorHandler<DepositFormValues> = (errors) => {
    const errorMessages = [];

    if (errors.accountNumber?.message) {
      errorMessages.push(`Conta: ${errors.accountNumber.message}`);
    }

    if (errors.amount?.message) {
      errorMessages.push(`Valor do depósito: ${errors.amount.message}`);
    }

    if (errorMessages.length > 0) {
      console.error('Form validation errors:', errors);
    }
  };

  return (
    <Dialog open={isOpen} onOpenChange={(open) => !open && handleOnClose()}>
      <DialogContent className="sm:max-w-[425px]">
        <DialogHeader>
          <DialogTitle>Depositar Fundos</DialogTitle>
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
                  <FormLabel htmlFor="account">Conta de Destino</FormLabel>
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
                        <SelectItem key={account.id} value={account.number}>
                          {account.name} - {formatCurrency(account.balance)}
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
                  <FormLabel htmlFor="amount">Valor do depósito</FormLabel>
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
                    Descrição (Opcional)
                  </FormLabel>
                  <FormControl>
                    <Input
                      id="description"
                      {...field}
                      placeholder="Descrição do depósito"
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
              <Button
                type="submit"
                disabled={isLoading}
                className="cursor-pointer"
              >
                {isLoading ? 'Processando...' : 'Depositar'}
              </Button>
            </DialogFooter>
          </form>
        </Form>
      </DialogContent>
    </Dialog>
  );
}
