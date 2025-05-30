import {
  Dialog,
  DialogContent,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from './ui/dialog';
import { formatCurrencyInput } from '@/lib/utils';
import { useState } from 'react';
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
  CreateAccountFormSchema,
  type CreateAccountFormValues,
} from '@/types/forms/createAccountForm';
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from './ui/form';

interface CreateAccountModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export function CreateAccountModal({
  isOpen,
  onClose,
}: CreateAccountModalProps) {
  const { createAccount } = useAccounts();

  const form = useForm<CreateAccountFormValues>({
    resolver: zodResolver(CreateAccountFormSchema),
    defaultValues: {
      name: '',
      type: undefined,
      balance: undefined,
    },
  });

  const [formattedBalance, setFormattedBalance] = useState('');

  const handleBalanceChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { value, formattedValue } = formatCurrencyInput(e.target.value);
    setFormattedBalance(formattedValue);

    form.setValue('balance', value, { shouldValidate: true });
  };

  async function onSubmit(data: CreateAccountFormValues) {
    await createAccount({
      name: data.name,
      type: data.type,
      balance: data.balance,
    });

    onClose();
    form.reset();
    setFormattedBalance('');
  }

  const onInvalid: SubmitErrorHandler<CreateAccountFormValues> = (errors) => {
    const errorMessages = [];

    if (errors.name?.message) {
      errorMessages.push(`Nome da conta: ${errors.name.message}`);
    }

    if (errors.type?.message) {
      errorMessages.push(`Tipo da conta: ${errors.type.message}`);
    }

    if (errors.balance?.message) {
      errorMessages.push(`Saldo inicial: ${errors.balance.message}`);
    }
  };

  return (
    <Dialog open={isOpen} onOpenChange={(open) => !open && onClose()}>
      <DialogContent className="sm:max-w-[425px]">
        <DialogHeader>
          <DialogTitle>Criar Nova Conta</DialogTitle>
        </DialogHeader>

        <Form {...form}>
          <form
            onSubmit={form.handleSubmit(onSubmit, onInvalid)}
            className="space-y-4"
          >
            <FormField
              control={form.control}
              name="name"
              render={({ field }) => (
                <FormItem>
                  <FormLabel htmlFor="accountName">Nome da conta</FormLabel>
                  <FormControl>
                    <Input
                      id="accountName"
                      placeholder="Nome da conta"
                      {...field}
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            <FormField
              control={form.control}
              name="type"
              render={({ field }) => (
                <FormItem>
                  <FormLabel htmlFor="accountType">Tipo de Conta</FormLabel>
                  <Select onValueChange={field.onChange}>
                    <FormControl>
                      <SelectTrigger id="accountType" className="w-full">
                        <SelectValue placeholder="Selecione o tipo de conta" />
                      </SelectTrigger>
                    </FormControl>
                    <SelectContent>
                      <SelectItem value="CHECKING">Conta Corrente</SelectItem>
                      <SelectItem value="SAVINGS">Poupança</SelectItem>
                      <SelectItem value="INVESTMENTS">Investimento</SelectItem>
                    </SelectContent>
                  </Select>
                  <FormMessage />
                </FormItem>
              )}
            />

            <FormField
              control={form.control}
              name="balance"
              render={() => (
                <FormItem>
                  <FormLabel htmlFor="initialBalance">Saldo Inicial</FormLabel>
                  <FormControl>
                    <Input
                      id="initialBalance"
                      value={formattedBalance}
                      onChange={handleBalanceChange}
                      placeholder="R$ 0,00"
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            <DialogFooter className="pt-4">
              <Button type="button" variant="outline" onClick={onClose}>
                Cancelar
              </Button>
              <Button type="submit">Criar conta</Button>
            </DialogFooter>
          </form>
        </Form>
      </DialogContent>
    </Dialog>
  );
}
