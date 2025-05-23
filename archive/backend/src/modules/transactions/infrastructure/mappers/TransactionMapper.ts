import {
  ListTransactionsResponseDto,
  TransactionDto,
} from '../../application/dtos/TransactionDto';
import { Transaction } from '../../domain/entities/Transaction';

export class TransactionMapper {
  public static toDto(transaction: Transaction): TransactionDto {
    return {
      id: transaction.id.toString(),
      type: transaction.type.toString(),
      fromAccountId: transaction.fromId?.toString(),
      fromAccountNumber: transaction.fromAccountNumber?.toString(),
      toAccountId: transaction.toId?.toString(),
      toAccountNumber: transaction.toAccountNumber?.toString(),
      amount: transaction.value.getValue(),
      description: transaction.description?.toString(),
      createdAt: transaction.createdAt.toString(),
    };
  }

  public static toDtoList(
    transactions: Transaction[],
  ): ListTransactionsResponseDto {
    return {
      transactions: transactions.map(this.toDto),
    };
  }
}
