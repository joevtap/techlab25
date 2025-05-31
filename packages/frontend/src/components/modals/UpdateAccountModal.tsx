import {
  Dialog,
  DialogContent,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from '../ui/dialog';
import { useEffect } from 'react';
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
  UpdateAccountFormSchema,
  type UpdateAccountFormValues,
} from '@/types/forms/updateAccountForm';
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from '../ui/form';

interface UpdateAccountModalProps {
  isOpen: boolean;
  onClose: () => void;
  accountId: string | null;
}

export function UpdateAccountModal({
  isOpen,
  onClose,
  accountId,
}: UpdateAccountModalProps) {
  const { accounts, updateAccount } = useAccounts();
  const account = accountId
    ? accounts.find((acc) => acc.id === accountId)
    : null;

  const form = useForm<UpdateAccountFormValues>({
    resolver: zodResolver(UpdateAccountFormSchema),
    defaultValues: {
      name: account?.name || '',
      type: account?.type,
    },
  });

  useEffect(() => {
    if (account) {
      form.setValue('name', account.name);
      form.setValue('type', account.type);
    } else {
      form.reset({
        name: '',
        type: undefined,
      });
    }
  }, [account, form]);

  const handleOnClose = () => {
    form.reset();
    onClose();
  };

  async function onSubmit(data: UpdateAccountFormValues) {
    if (!accountId || !account) return;

    await updateAccount({
      id: accountId,
      name: data.name,
      type: data.type,
    });

    onClose();
  }

  const onInvalid: SubmitErrorHandler<UpdateAccountFormValues> = (errors) => {
    const errorMessages = [];

    if (errors.name?.message) {
      errorMessages.push(`Nome da conta: ${errors.name.message}`);
    }

    if (errors.type?.message) {
      errorMessages.push(`Tipo da conta: ${errors.type.message}`);
    }
  };

  return (
    <Dialog open={isOpen} onOpenChange={(open) => !open && onClose()}>
      <DialogContent className="sm:max-w-[425px]">
        <DialogHeader>
          <DialogTitle>Atualizar Conta</DialogTitle>
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
                  <Select
                    onValueChange={field.onChange}
                    defaultValue={field.value}
                  >
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

            <DialogFooter className="pt-4">
              <Button type="button" variant="outline" onClick={handleOnClose}>
                Cancelar
              </Button>
              <Button type="submit">Atualizar conta</Button>
            </DialogFooter>
          </form>
        </Form>
      </DialogContent>
    </Dialog>
  );
}
