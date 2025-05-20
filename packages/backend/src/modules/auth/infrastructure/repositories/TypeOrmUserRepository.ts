import { inject, injectable } from 'inversify';
import { DataSource, EntityManager } from 'typeorm';

import { Id, Email } from '../../../../core/domain/value-objects';
import { TransactionRegistry } from '../../../../infrastructure/orm/TypeOrmUnitOfWork';
import { User } from '../../domain/entities/User';
import { IUserRepository } from '../../domain/repositories/IUserRepository';
import { TypeOrmUserMapper } from '../mappers/user/TypeOrmUserMapper';
import { UserEntity } from '../orm/entities';

@injectable()
export class TypeOrmUserRepository implements IUserRepository {
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

  public async findById(id: Id, transactionId?: symbol): Promise<User | null> {
    const manager = this.getManager(transactionId);

    const user = await manager.findOneBy(UserEntity, {
      id: id.toString(),
    });

    if (user) {
      return TypeOrmUserMapper.toDomain(user);
    }

    return null;
  }

  public async findByEmail(
    email: Email,
    transactionId?: symbol,
  ): Promise<User | null> {
    const manager = this.getManager(transactionId);

    const user = await manager.findOneBy(UserEntity, {
      email: email.toString(),
    });

    if (user) {
      return TypeOrmUserMapper.toDomain(user);
    }

    return null;
  }

  public async save(user: User, transactionId?: symbol): Promise<void> {
    const manager = this.getManager(transactionId);

    const userEntity = manager.create(
      UserEntity,
      TypeOrmUserMapper.toTypeOrm(user),
    );

    await manager.save(userEntity);
  }
}
