import { Button } from '@/components/ui/button';
import { PlusCircle, MinusCircle, ArrowRightLeft } from 'lucide-react';

interface OperationButtonsProps {
  onTransfer: () => void;
  onDeposit: () => void;
  onWithdraw: () => void;
  disabled?: boolean;
}

export function OperationButtons({
  onTransfer,
  onDeposit,
  onWithdraw,
  disabled = false,
}: OperationButtonsProps) {
  return (
    <div className="flex flex-col gap-2">
      <Button
        variant="outline"
        size="sm"
        className="flex items-center gap-1 w-full cursor-pointer"
        onClick={onTransfer}
        disabled={disabled}
      >
        <ArrowRightLeft className="h-4 w-4" />
        <span>Transferir</span>
      </Button>
      <Button
        variant="outline"
        size="sm"
        className="flex items-center gap-1 w-full cursor-pointer"
        onClick={onDeposit}
        disabled={disabled}
      >
        <PlusCircle className="h-4 w-4" />
        <span>Depositar</span>
      </Button>
      <Button
        variant="outline"
        size="sm"
        className="flex items-center gap-1 w-full cursor-pointer"
        onClick={onWithdraw}
        disabled={disabled}
      >
        <MinusCircle className="h-4 w-4" />
        <span>Sacar</span>
      </Button>
    </div>
  );
}
