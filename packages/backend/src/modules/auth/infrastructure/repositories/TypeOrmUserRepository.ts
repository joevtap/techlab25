import { inject, injectable } from 'inversify';
import { DataSource, EntityManager } from 'typeorm';

import { Id, Email } from '../../../../core/domain/value-objects';
import { RepositoryOptions } from '../../../../infrastructure/orm/RepositoryOptions';
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

  private getManager(options?: RepositoryOptions): EntityManager {
    return options?.transactionManager ?? this.dataSource.manager;
  }

  public async findById(
    id: Id,
    options?: RepositoryOptions,
  ): Promise<User | null> {
    const manager = this.getManager(options);

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
    options?: RepositoryOptions,
  ): Promise<User | null> {
    const manager = this.getManager(options);

    const user = await manager.findOneBy(UserEntity, {
      email: email.toString(),
    });

    if (user) {
      return TypeOrmUserMapper.toDomain(user);
    }

    return null;
  }

  public async save(user: User, options?: RepositoryOptions): Promise<void> {
    const manager = this.getManager(options);

    const userEntity = manager.create(
      UserEntity,
      TypeOrmUserMapper.toTypeOrm(user),
    );

    await manager.save(userEntity);
  }
}
