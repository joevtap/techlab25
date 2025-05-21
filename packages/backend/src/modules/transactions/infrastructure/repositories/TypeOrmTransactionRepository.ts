import { inject, injectable } from 'inversify';
import { Between, DataSource, EntityManager } from 'typeorm';

import { Id } from '../../../../core/domain/value-objects';
import { TransactionRegistry } from '../../../../infrastructure/orm/TypeOrmUnitOfWork';
import { Transaction } from '../../domain/entities/Transaction';
import { ITransactionRepository } from '../../domain/repositories/ITransactionRepository';
import { TransactionDate } from '../../domain/value-objects/TransactionDate';
import { TypeOrmTransactionMapper } from '../mappers/TypeOrmTransactionMapper';
import { TransactionEntity } from '../orm/TransactionEntity';

@injectable()
export class TypeOrmTransactionRepository implements ITransactionRepository {
  public constructor(
    @inject(Symbol.for('TypeOrmDataSource'))
    private readonly dataSource: DataSource,
  ) {}

  private getManager(transactionId?: symbol): EntityManager {
    if (transactionId) {
      const transactionManager = TransactionRegistry.get(transactionId);
      if (transactionManager) {
        return transactionManager as EntityManager;
      }
    }
    return this.dataSource.manager;
  }

  public async save(
    transaction: Transaction,
    transactionId?: symbol,
  ): Promise<void> {
    const manager = this.getManager(transactionId);

    const transactionEntity = manager.create(
      TransactionEntity,
      TypeOrmTransactionMapper.toTypeOrm(transaction),
    );

    await manager.save(transactionEntity);
  }

  public async listByAccountId(
    id: Id,
    transactionId?: symbol,
  ): Promise<Transaction[]> {
    const manager = this.getManager(transactionId);

    const transactions = await manager.find(TransactionEntity, {
      where: [{ fromId: id.toString() }, { toId: id.toString() }],
    });

    return transactions.map(TypeOrmTransactionMapper.toDomain);
  }

  public async listByAccountIdAndPeriod(
    id: Id,
    from: TransactionDate,
    to: TransactionDate,
    transactionId?: symbol,
  ): Promise<Transaction[]> {
    const manager = this.getManager(transactionId);

    const transactions = await manager.find(TransactionEntity, {
      where: [
        { fromId: id.toString() },
        { toId: id.toString() },
        {
          createdAt: Between(from.getValue(), to.getValue()),
        },
      ],
    });

    return transactions.map(TypeOrmTransactionMapper.toDomain);
  }
}
