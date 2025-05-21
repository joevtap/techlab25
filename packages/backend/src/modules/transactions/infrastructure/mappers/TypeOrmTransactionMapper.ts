import { Id } from '../../../../core/domain/value-objects';
import { Transaction } from '../../domain/entities/Transaction';
import { AccountNumber } from '../../domain/value-objects/AccountNumber';
import { Description } from '../../domain/value-objects/Description';
import { TransactionDate } from '../../domain/value-objects/TransactionDate';
import { TransactionValue } from '../../domain/value-objects/TransactionValue';
import { TransactionEntity } from '../orm/TransactionEntity';

export class TypeOrmTransactionMapper {
  public static toDomain(input: TransactionEntity): Transaction {
    if (input.type === 'DEBIT') {
      return Transaction.debit({
        id: new Id(input.id),
        fromId: new Id(input.fromId!),
        fromAccountNumber: new AccountNumber(input.from!.accountNumber),
        value: new TransactionValue(input.value),
        description: new Description(input.description),
        createdAt: new TransactionDate(input.createdAt),
      });
    }

    if (input.type === 'CREDIT') {
      return Transaction.credit({
        id: new Id(input.id),
        toId: new Id(input.toId!),
        toAccountNumber: new AccountNumber(input.to!.accountNumber),
        value: new TransactionValue(input.value),
        description: new Description(input.description),
        createdAt: new TransactionDate(input.createdAt),
      });
    }

    return Transaction.transfer({
      id: new Id(input.id),
      fromId: new Id(input.fromId!),
      fromAccountNumber: new AccountNumber(input.from!.accountNumber),
      toId: new Id(input.toId!),
      toAccountNumber: new AccountNumber(input.to!.accountNumber),
      value: new TransactionValue(input.value),
      description: new Description(input.description),
      createdAt: new TransactionDate(input.createdAt),
    });
  }

  public static toTypeOrm(
    input: Transaction,
  ): Omit<TransactionEntity, 'to' | 'from'> {
    return {
      id: input.id.toString(),
      type: input.type.toString(),
      fromId: input.fromId?.toString(),
      toId: input.toId?.toString(),
      value: input.value.getValue(),
      description: input.description?.toString(),
      createdAt: input.createdAt.getValue(),
    };
  }
}
