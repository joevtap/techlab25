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
  TransferFormSchema,
  type TransferFormValues,
} from '@/types/forms/transferForm';
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from '../ui/form';
import type { Account } from '@/types/account';
import { Undo } from 'lucide-react';

type TransferModalProps = {
  isOpen: boolean;
  onClose: () => void;
  accounts: Account[];
  selectedAccountId: string;
};

export function TransferModal({
  isOpen,
  onClose,
  accounts,
  selectedAccountId,
}: TransferModalProps) {
  const { transferBetweenAccounts } = useAccounts();
  const selectedAccount = accounts.find(
    (account) => account.id === selectedAccountId,
  );

  const [manualAccountEntry, setManualAccountEntry] = useState(false);

  const form = useForm<TransferFormValues>({
    resolver: zodResolver(TransferFormSchema),
    defaultValues: {
      sourceAccountNumber: selectedAccount?.number || '',
      targetAccountNumber: '',
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
    setManualAccountEntry(false);
    onClose();
  };

  async function onSubmit(data: TransferFormValues) {
    const success = await transferBetweenAccounts(
      data.sourceAccountNumber,
      data.targetAccountNumber,
      data.amount,
      data.description,
    );

    if (success) {
      handleOnClose();
    }
  }

  const onInvalid: SubmitErrorHandler<TransferFormValues> = (errors) => {
    const errorMessages = [];

    if (errors.sourceAccountNumber?.message) {
      errorMessages.push(
        `Conta de origem: ${errors.sourceAccountNumber.message}`,
      );
    }

    if (errors.targetAccountNumber?.message) {
      errorMessages.push(
        `Conta de destino: ${errors.targetAccountNumber.message}`,
      );
    }

    if (errors.amount?.message) {
      errorMessages.push(`Valor: ${errors.amount.message}`);
    }

    if (errorMessages.length > 0) {
      console.error('Form validation errors:', errors);
    }
  };

  useEffect(() => {
    if (isOpen && selectedAccountId && selectedAccount) {
      form.setValue('sourceAccountNumber', selectedAccount.number, {
        shouldValidate: true,
      });
    }
  }, [isOpen, selectedAccountId, selectedAccount, form]);

  return (
    <Dialog open={isOpen} onOpenChange={(open) => !open && handleOnClose()}>
      <DialogContent className="sm:max-w-[425px]">
        <DialogHeader>
          <DialogTitle>Transferir entre contas</DialogTitle>
        </DialogHeader>

        <Form {...form}>
          <form
            onSubmit={form.handleSubmit(onSubmit, onInvalid)}
            className="space-y-4"
          >
            <FormField
              control={form.control}
              name="sourceAccountNumber"
              render={({ field }) => (
                <FormItem>
                  <FormLabel htmlFor="sourceAccount">Conta de origem</FormLabel>
                  <Select
                    onValueChange={field.onChange}
                    defaultValue={field.value}
                  >
                    <FormControl>
                      <SelectTrigger id="sourceAccount" className="w-full">
                        <SelectValue placeholder="Selecione a conta de origem" />
                      </SelectTrigger>
                    </FormControl>
                    <SelectContent>
                      {accounts.map((account) => (
                        <SelectItem key={account.number} value={account.number}>
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
              name="targetAccountNumber"
              render={({ field }) => (
                <FormItem>
                  <FormLabel htmlFor="targetAccount">
                    Conta de destino
                  </FormLabel>
                  {!manualAccountEntry ? (
                    <>
                      <Select
                        onValueChange={(value) => {
                          if (value === 'manual') {
                            setManualAccountEntry(true);
                            field.onChange('');
                          } else {
                            field.onChange(value);
                          }
                        }}
                        defaultValue={field.value}
                      >
                        <FormControl>
                          <SelectTrigger id="targetAccount" className="w-full">
                            <SelectValue placeholder="Selecione a conta de destino" />
                          </SelectTrigger>
                        </FormControl>
                        <SelectContent>
                          {accounts.map((account) => (
                            <SelectItem
                              key={account.number}
                              value={account.number}
                            >
                              {account.name} - {formatCurrency(account.balance)}
                            </SelectItem>
                          ))}
                          <SelectItem value="manual">
                            Outra, informar número
                          </SelectItem>
                        </SelectContent>
                      </Select>
                    </>
                  ) : (
                    <div className="flex gap-2 items-center">
                      <FormControl>
                        <Input
                          id="manualTargetAccount"
                          placeholder="Digite o número da conta"
                          {...field}
                          className="w-full"
                        />
                      </FormControl>
                      <Button
                        type="button"
                        variant="outline"
                        aria-label="Voltar para seleção de conta"
                        onClick={() => {
                          setManualAccountEntry(false);
                          field.onChange('');
                        }}
                      >
                        <Undo size={18} />
                      </Button>
                    </div>
                  )}
                  <FormMessage />
                </FormItem>
              )}
            />

            <FormField
              control={form.control}
              name="amount"
              render={() => (
                <FormItem>
                  <FormLabel htmlFor="amount">Valor da transferência</FormLabel>
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
                      placeholder="Adicione uma descrição para essa transferência"
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
                Transferir
              </Button>
            </DialogFooter>
          </form>
        </Form>
      </DialogContent>
    </Dialog>
  );
}
