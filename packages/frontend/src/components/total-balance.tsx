import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { formatCurrency } from '@/lib/utils';

interface TotalBalanceProps {
  balance: number;
}

export function TotalBalance({ balance }: TotalBalanceProps) {
  return (
    <div className="pt-4">
      <Card>
        <CardHeader className="py-4 px-5">
          <CardTitle className="text-base font-medium">Saldo Total</CardTitle>
        </CardHeader>
        <CardContent className="py-2 px-5">
          <div className="text-2xl font-bold">{formatCurrency(balance)}</div>
        </CardContent>
      </Card>
    </div>
  );
}
