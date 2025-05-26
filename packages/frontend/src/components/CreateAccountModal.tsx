import {
  Dialog,
  DialogContent,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from './ui/dialog';
import { formatCurrencyInput } from '@/lib/utils';
import { Label } from '@radix-ui/react-label';
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

interface CreateAccountModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export function CreateAccountModal({
  isOpen,
  onClose,
}: CreateAccountModalProps) {
  const [accountType, setAccountType] = useState('');
  const [formattedBalance, setFormattedBalance] = useState('');
  const { createAccount } = useAccounts();

  const handleBalanceChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { formattedValue } = formatCurrencyInput(e.target.value);
    setFormattedBalance(formattedValue);
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    console.log('submit');

    await createAccount({
      name: 'Teste',
      balance: 10_000_00,
      type: 'CHECKING',
    });
  };

  return (
    <Dialog open={isOpen} onOpenChange={(open) => !open && onClose()}>
      <DialogContent className="sm:max-w-[425px]">
        <DialogHeader>
          <DialogTitle>Criar Nova Conta</DialogTitle>
        </DialogHeader>
        <form onSubmit={handleSubmit}>
          <div className="flex flex-col gap-4 py-4">
            <div className="flex flex-col gap-1">
              <Label htmlFor="accountType">Tipo de Conta</Label>
              <Select value={accountType} onValueChange={setAccountType}>
                <SelectTrigger id="accountType" className="w-full">
                  <SelectValue placeholder="Selecione o tipo de conta" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="CHECKING">Conta Corrente</SelectItem>
                  <SelectItem value="SAVINGS">Poupança</SelectItem>
                  <SelectItem value="INVESTMENT">Investimento</SelectItem>
                </SelectContent>
              </Select>
            </div>
            <div className="flex flex-col gap-1">
              <Label htmlFor="initialBalance">Saldo Inicial</Label>
              <Input
                id="initialBalance"
                value={formattedBalance}
                onChange={handleBalanceChange}
                placeholder="R$ 0,00"
              />
            </div>
          </div>
          <DialogFooter>
            <Button type="button" variant="outline" onClick={onClose}>
              Cancelar
            </Button>
            <Button type="submit">Criar conta</Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  );
}
