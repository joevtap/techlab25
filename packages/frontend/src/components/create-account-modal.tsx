import { toast } from 'sonner';
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

interface CreateAccountModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export function CreateAccountModal({
  isOpen,
  onClose,
}: CreateAccountModalProps) {
  const [accountType, setAccountType] = useState('');
  const [initialBalance, setInitialBalance] = useState('');
  const [formattedBalance, setFormattedBalance] = useState('');
  const [isLoading, setIsLoading] = useState(false);

  const handleBalanceChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { value, formattedValue } = formatCurrencyInput(e.target.value);
    setInitialBalance(value);
    setFormattedBalance(formattedValue);
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();

    if (!accountType || !initialBalance) {
      toast.error('Preencha todos os campos obrigatórios');
      return;
    }

    const balance = Number.parseFloat(initialBalance);
    if (isNaN(balance) || balance < 0) {
      toast.error('Insira um saldo inicial válido');
      return;
    }

    setIsLoading(true);

    setTimeout(() => {
      const existingAccountsJSON = localStorage.getItem('userAccounts');
      const existingAccounts = existingAccountsJSON
        ? JSON.parse(existingAccountsJSON)
        : [];

      const accountTypeMap = {
        CHECKING: 'Conta Corrente',
        SAVINGS: 'Poupança',
        INVESTMENT: 'Investimento',
      };

      const newAccount = {
        id: (existingAccounts.length + 1).toString(),
        type:
          accountTypeMap[accountType as keyof typeof accountTypeMap] ||
          accountType,
        number: Math.floor(10000000 + Math.random() * 90000000).toString(),
        balance: balance,
        currency: 'BRL',
      };

      const updatedAccounts = [...existingAccounts, newAccount];
      localStorage.setItem('userAccounts', JSON.stringify(updatedAccounts));
      localStorage.setItem('hasAccounts', 'true');

      setIsLoading(false);
      toast.success('Conta criada com sucesso');

      resetForm();
      onClose();

      window.location.reload();
    }, 1000);
  };

  const resetForm = () => {
    setAccountType('');
    setInitialBalance('');
    setFormattedBalance('');
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
            <Button type="submit" disabled={isLoading}>
              {isLoading ? 'Criando...' : 'Criar Conta'}
            </Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  );
}
