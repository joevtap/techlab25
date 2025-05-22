import { inject, injectable } from 'inversify';
import { DataSource, EntityManager } from 'typeorm';

import { Account } from '../../entities/Account';
import { Id, AccountNumber, AccountType } from '../../entities/types';
import { IAccountRepository } from '../../repositories/IAccountRepository';
import { AccountPersistenceEntity } from '../orm';
import { TOKENS } from '../Tokens';

@injectable()
export class AccountRepository implements IAccountRepository {
  public manager: EntityManager;

  public constructor(@inject(TOKENS.DATA_SOURCE) dataSource: DataSource) {
    this.manager = dataSource.manager;
  }

  public async findByOwnerId(ownerId: Id): Promise<Account[]> {
    const accounts = await this.manager.find(AccountPersistenceEntity, {
      where: {
        owner: {
          id: ownerId,
        },
      },
      relations: {
        owner: true,
      },
    });

    return accounts.map(
      (a) =>
        new Account(
          a.id,
          a.type as AccountType,
          a.name,
          a.number,
          a.balance,
          a.owner.id,
        ),
    );
  }

  public async findByNumber(number: AccountNumber): Promise<Account | null> {
    const account = await this.manager.findOne(AccountPersistenceEntity, {
      where: { number },
      relations: { owner: true },
    });

    if (account) {
      return new Account(
        account.id,
        account.type as AccountType,
        account.name,
        account.number,
        account.balance,
        account.owner.id,
      );
    }

    return null;
  }

  public async findById(id: Id): Promise<Account | null> {
    const account = await this.manager.findOne(AccountPersistenceEntity, {
      where: { id },
      relations: {
        owner: true,
      },
    });

    if (account) {
      return new Account(
        account.id,
        account.type as AccountType,
        account.name,
        account.number,
        account.balance,
        account.owner.id,
      );
    }

    return null;
  }

  public async findAll(): Promise<Account[]> {
    const accounts = await this.manager.find(AccountPersistenceEntity, {
      relations: {
        owner: true,
      },
    });

    return accounts.map(
      (a) =>
        new Account(
          a.id,
          a.type as AccountType,
          a.name,
          a.number,
          a.balance,
          a.owner.id,
        ),
    );
  }

  public async add(entity: Account): Promise<Account> {
    const account = this.manager.create(AccountPersistenceEntity, {
      id: entity.id,
      type: entity.type,
      name: entity.name,
      number: entity.number,
      balance: entity.balance,
      owner: {
        id: entity.ownerId,
      },
    });

    await this.manager.save(account);

    return entity;
  }

  public async update(entity: Account): Promise<Account> {
    await this.manager.update(AccountPersistenceEntity, entity.id, {
      type: entity.type,
      name: entity.name,
      number: entity.number,
      balance: entity.balance,
      owner: {
        id: entity.ownerId,
      },
    });

    return entity;
  }

  public async remove(id: Id): Promise<void> {
    await this.manager.delete(AccountPersistenceEntity, { id });
  }
}
