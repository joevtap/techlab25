import { inject, injectable } from 'inversify';
import { DataSource, EntityManager } from 'typeorm';

import { RepositoryOptions } from '../../../../infrastructure/orm/RepositoryOptions';
import { Account } from '../../domain/entities/Account';
import { IAccountRepository } from '../../domain/repositories/IAccountRepository';
import { TypeOrmAccountMapper } from '../mappers/account/TypeOrmAccountMapper';
import { AccountEntity } from '../orm/entities/AccountEntity';

@injectable()
export class TypeOrmAccountRepository implements IAccountRepository {
  public constructor(
    @inject(Symbol.for('TypeOrmDataSource'))
    private readonly dataSource: DataSource,
  ) {}

  private getManager(options?: RepositoryOptions): EntityManager {
    return options?.transactionManager ?? this.dataSource.manager;
  }

  public async save(
    account: Account,
    options?: RepositoryOptions,
  ): Promise<void> {
    const manager = this.getManager(options);

    const userEntity = manager.create(
      AccountEntity,
      TypeOrmAccountMapper.toTypeOrm(account),
    );

    await manager.save(userEntity);
  }
}
