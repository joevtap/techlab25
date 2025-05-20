import { Container } from 'inversify';

import { Module } from '../../core/application/Module';

import { IAccountRepository } from './domain/repositories/IAccountRepository';
import { TypeOrmAccountRepository } from './infrastructure/repositories/TypeOrmAccountRepository';

export class AccountModule extends Module {
  public readonly name = 'account';

  public register(container: Container) {
    container
      .bind<IAccountRepository>(Symbol.for('AccountRepository'))
      .to(TypeOrmAccountRepository);
  }

  public routers() {
    return [];
  }
}
