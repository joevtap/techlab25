import { inject, injectable } from 'inversify';
import { DataSource } from 'typeorm';

import { IUnitOfWork } from '../../core/application/transactions/IUnitOfWork';

@injectable()
export class TypeOrmUnitOfWork implements IUnitOfWork {
  constructor(
    @inject(Symbol.for('TypeOrmDataSource'))
    private dataSource: DataSource,
  ) {}

  async runInTransaction<T>(
    callback: (transactionId: symbol) => Promise<T>,
  ): Promise<T> {
    const queryRunner = this.dataSource.createQueryRunner();
    await queryRunner.connect();
    await queryRunner.startTransaction();

    const transactionId = Symbol('transaction');

    TransactionRegistry.register(transactionId, queryRunner.manager);

    try {
      const result = await callback(transactionId);
      await queryRunner.commitTransaction();
      return result;
    } catch (error) {
      await queryRunner.rollbackTransaction();
      throw error;
    } finally {
      TransactionRegistry.unregister(transactionId);
      await queryRunner.release();
    }
  }
}

export class TransactionRegistry {
  private static transactions = new Map<symbol, unknown>();

  static register(id: symbol, manager: unknown): void {
    this.transactions.set(id, manager);
  }

  static get(id: symbol): unknown | undefined {
    return this.transactions.get(id);
  }

  static unregister(id: symbol): void {
    this.transactions.delete(id);
  }
}
