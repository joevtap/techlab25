import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { formatCurrency } from '@/lib/utils';

interface TotalBalanceProps {
  balance: number;
}

export function TotalBalance({ balance }: TotalBalanceProps) {
  return (
    <Card>
      <CardHeader>
        <CardTitle className="text-base font-medium">Saldo Total</CardTitle>
      </CardHeader>
      <CardContent>
        <div className="text-2xl font-bold">{formatCurrency(balance)}</div>
      </CardContent>
    </Card>
  );
}
