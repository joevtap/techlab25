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

interface Account {
  id: string;
  type: string;
  number: string;
  balance: number;
  currency: string;
}

interface DepositModalProps {
  isOpen: boolean;
  onClose: () => void;
  accounts: Account[];
  selectedAccountId: string;
}

export function DepositModal({
  isOpen,
  onClose,
  accounts,
  selectedAccountId,
}: DepositModalProps) {
  const [accountId, setAccountId] = useState(selectedAccountId);
  const [amount, setAmount] = useState('');
  const [formattedAmount, setFormattedAmount] = useState('');
  const [description, setDescription] = useState('');
  const [isLoading, setIsLoading] = useState(false);

  useEffect(() => {
    if (selectedAccountId && isOpen) {
      setAccountId(selectedAccountId);
    }
  }, [selectedAccountId, isOpen]);

  const handleAmountChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { value, formattedValue } = formatCurrencyInput(e.target.value);
    setAmount(value);
    setFormattedAmount(formattedValue);
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();

    if (!accountId || !amount) {
      toast.error('Por favor, preencha todos os campos obrigatórios');
      return;
    }

    const depositAmount = Number.parseFloat(amount);
    if (isNaN(depositAmount) || depositAmount <= 0) {
      toast.error('Por favor, insira um valor válido');
      return;
    }

    setIsLoading(true);

    // Simulate API call
    setTimeout(() => {
      setIsLoading(false);
      toast.success(
        `Depósito de ${formatCurrencyInput(depositAmount.toString())} realizado com sucesso`,
      );
      resetForm();
      onClose();
    }, 1000);
  };

  const resetForm = () => {
    setAccountId(selectedAccountId);
    setAmount('');
    setFormattedAmount('');
    setDescription('');
  };

  return (
    <Dialog open={isOpen} onOpenChange={(open) => !open && onClose()}>
      <DialogContent className="sm:max-w-[425px]">
        <DialogHeader>
          <DialogTitle>Depositar Fundos</DialogTitle>
        </DialogHeader>
        <form onSubmit={handleSubmit}>
          <div className="flex flex-col gap-4 py-4">
            <div className="flex flex-col gap-2">
              <Label htmlFor="account">Conta de Destino</Label>
              <Select value={accountId} onValueChange={setAccountId}>
                <SelectTrigger id="account" className="w-full">
                  <SelectValue placeholder="Selecione a conta" />
                </SelectTrigger>
                <SelectContent>
                  {accounts.map((account) => (
                    <SelectItem key={account.id} value={account.id}>
                      {account.type} ({account.number})
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
            <div className="flex flex-col gap-2">
              <Label htmlFor="amount">Valor</Label>
              <Input
                id="amount"
                value={formattedAmount}
                onChange={handleAmountChange}
                placeholder="R$ 0,00"
              />
            </div>
            <div className="flex flex-col gap-2">
              <Label htmlFor="description">Descrição (Opcional)</Label>
              <Input
                id="description"
                value={description}
                onChange={(e) => setDescription(e.target.value)}
                placeholder="Descrição do depósito"
              />
            </div>
          </div>
          <DialogFooter>
            <Button type="button" variant="outline" onClick={onClose}>
              Cancelar
            </Button>
            <Button type="submit" disabled={isLoading}>
              {isLoading ? 'Processando...' : 'Depositar'}
            </Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  );
}
