import { Container } from 'inversify';
import { DataSource } from 'typeorm';

import { Module } from './core/application/Module';
import { IUnitOfWork } from './core/application/transactions/IUnitOfWork';
import { IIdGenerator } from './core/domain/services/IIdGenerator';
import { applicationDataSource } from './infrastructure/orm/data-source';
import { TypeOrmUnitOfWork } from './infrastructure/orm/TypeOrmUnitOfWork';
import { NanoIdGenerator } from './infrastructure/services/NanoIdGenerator';
import { AccountModule } from './modules/account/AccountModule';
import { AuthModule } from './modules/auth/AuthModule';

const container = new Container({ defaultScope: 'Request' });

const modules: Module[] = [new AuthModule(), new AccountModule()];

export async function initializeDiContainer() {
  container
    .bind<DataSource>(Symbol.for('TypeOrmDataSource'))
    .toConstantValue(applicationDataSource);

  container.bind<IIdGenerator>(Symbol.for('IdGenerator')).to(NanoIdGenerator);

  container.bind<IUnitOfWork>(Symbol.for('UnitOfWork')).to(TypeOrmUnitOfWork);

  modules.forEach((m) => {
    m.register(container);
    console.log(`Module ${m.name} registered to DI container`);
  });
}

export { container, modules };
