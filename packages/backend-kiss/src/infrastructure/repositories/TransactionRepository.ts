import { inject, injectable } from 'inversify';
import { DataSource, EntityManager } from 'typeorm';

import { Transaction } from '../../entities/Transaction';
import { AccountNumber, TransactionType } from '../../entities/types';
import { ITransactionRepository } from '../../repositories/ITransactionRespository';
import { TransactionPersistenceEntity } from '../orm';
import { TOKENS } from '../Tokens';

@injectable()
export class TransactionRepository implements ITransactionRepository {
  public manager: EntityManager;

  public constructor(@inject(TOKENS.DATA_SOURCE) dataSource: DataSource) {
    this.manager = dataSource.manager;
  }

  public async add(entity: Transaction): Promise<Transaction> {
    const transaction = this.manager.create(TransactionPersistenceEntity, {
      id: entity.id,
      type: entity.type,
      amount: entity.amount,
      description: entity.description,
      source: {
        number: entity.source,
      },
      target: {
        number: entity.target,
      },
      date: entity.date,
    });

    await this.manager.save(transaction);

    return entity;
  }

  public async findAllByAccountNumber(
    accountNumber: AccountNumber,
    from?: Date,
    to?: Date,
  ): Promise<Transaction[]> {
    const queryBuilder = this.manager
      .createQueryBuilder(TransactionPersistenceEntity, 'transaction')
      .leftJoinAndSelect('transaction.source', 'source')
      .leftJoinAndSelect('transaction.target', 'target')
      .where('source.number = :accountId OR target.number = :accountId', {
        accountId: accountNumber,
      });

    if (from) {
      queryBuilder.andWhere('transaction.date >= :from', { from });
    }

    if (to) {
      queryBuilder.andWhere('transaction.date <= :to', { to });
    }

    const transactions = await queryBuilder.getMany();

    return transactions.map(
      (t) =>
        new Transaction(
          t.id,
          t.date,
          t.amount,
          t.type as TransactionType,
          t.source.number,
          t.target.number,
          t.description,
        ),
    );
  }
}
