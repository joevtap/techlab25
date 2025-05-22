import { inject, injectable } from 'inversify';
import { EntityManager, DataSource } from 'typeorm';

import { Email, Id } from '../../entities/types';
import { User } from '../../entities/User';
import { IUserRepository } from '../../repositories/IUserRepository';
import { UserPersistenceEntity } from '../orm';
import { TOKENS } from '../Tokens';

@injectable()
export class UserRepository implements IUserRepository {
  public manager: EntityManager;

  constructor(@inject(TOKENS.DATA_SOURCE) dataSource: DataSource) {
    this.manager = dataSource.manager;
  }

  public async findByEmail(email: Email): Promise<User | null> {
    const user = await this.manager.findOneBy(UserPersistenceEntity, {
      email,
    });

    if (user) {
      return new User(user.id, user.email, user.username, user.hashedPassword);
    }

    return null;
  }

  public async findById(id: Id): Promise<User | null> {
    const user = await this.manager.findOneBy(UserPersistenceEntity, {
      id,
    });

    if (user) {
      return new User(user.id, user.email, user.username, user.hashedPassword);
    }

    return null;
  }

  public async findAll(): Promise<User[]> {
    const users = await this.manager.find(UserPersistenceEntity);

    return users.map(
      (u) => new User(u.id, u.email, u.username, u.hashedPassword),
    );
  }

  public async add(entity: User): Promise<User> {
    const user = this.manager.create(UserPersistenceEntity, {
      id: entity.id,
      username: entity.username,
      email: entity.email,
      hashedPassword: entity.password,
    });

    await this.manager.save(user);

    return entity;
  }

  public async update(entity: User): Promise<User> {
    await this.manager.update(UserPersistenceEntity, entity.id, {
      username: entity.username,
      email: entity.email,
      hashedPassword: entity.password,
    });

    return entity;
  }

  public async remove(id: Id): Promise<void> {
    await this.manager.delete(UserPersistenceEntity, { id });
  }
}
