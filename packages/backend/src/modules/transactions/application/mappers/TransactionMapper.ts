import { Transaction } from '../../domain/entities/Transaction';
import {
  ListTransactionsResponseDto,
  TransactionDto,
} from '../dtos/TransactionDto';

export class TransactionMapper {
  public static toDto(transaction: Transaction): TransactionDto {
    return {
      id: transaction.id.toString(),
      type: transaction.type.toString(),
      fromAccountId: transaction.fromId?.toString(),
      toAccountId: transaction.toId?.toString(),
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
