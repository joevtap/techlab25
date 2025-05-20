import { inject, injectable } from 'inversify';
import { DataSource, EntityManager } from 'typeorm';

import { TransactionRegistry } from '../../../../infrastructure/orm/TypeOrmUnitOfWork';
import { Account } from '../../domain/entities/Account';
import { IAccountRepository } from '../../domain/repositories/IAccountRepository';
import { AccountNumber } from '../../domain/value-objects/AccountNumber';
import { TypeOrmAccountMapper } from '../mappers/account/TypeOrmAccountMapper';
import { AccountEntity } from '../orm/entities/AccountEntity';

@injectable()
export class TypeOrmAccountRepository implements IAccountRepository {
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

  public async save(account: Account, transactionId?: symbol): Promise<void> {
    const manager = this.getManager(transactionId);

    const accountEntity = manager.create(
      AccountEntity,
      TypeOrmAccountMapper.toTypeOrm(account),
    );

    await manager.save(accountEntity);
  }

  public async findByAccountNumber(
    accountNumber: AccountNumber,
    transactionId?: symbol,
  ): Promise<Account | null> {
    const manager = this.getManager(transactionId);

    const account = await manager.findOneBy(AccountEntity, {
      accountNumber: accountNumber.toString(),
    });

    if (account) {
      return TypeOrmAccountMapper.toDomain(account);
    }

    return null;
  }
}
