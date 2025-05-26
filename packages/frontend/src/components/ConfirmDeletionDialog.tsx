import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from '@/components/ui/alert-dialog';
import { cn } from '@/lib/utils';
import { buttonVariants } from './ui/button';

interface ConfirmDeletionDiaglogProps {
  isOpen: boolean;
  onCancel: () => void;
  onConfirm: () => void;
}

export function ConfirmDeletionDialog({
  isOpen,
  onCancel,
  onConfirm,
}: ConfirmDeletionDiaglogProps) {
  return (
    <AlertDialog open={isOpen}>
      <AlertDialogContent>
        <AlertDialogHeader>
          <AlertDialogTitle>Tem certeza disso?</AlertDialogTitle>
          <AlertDialogDescription>
            Esta ação não pode ser desfeita. Uma vez deletada, o histórico das
            transações das quais a conta participou também será deletado.
          </AlertDialogDescription>
        </AlertDialogHeader>
        <AlertDialogFooter>
          <AlertDialogCancel
            onClick={() => {
              onCancel();
            }}
            className="cursor-pointer"
          >
            Cancelar
          </AlertDialogCancel>
          <AlertDialogAction
            onClick={() => {
              onConfirm();
            }}
            className={cn(
              buttonVariants({ variant: 'destructive' }),
              'cursor-pointer text-destructive-foreground',
            )}
          >
            Deletar
          </AlertDialogAction>
        </AlertDialogFooter>
      </AlertDialogContent>
    </AlertDialog>
  );
}
