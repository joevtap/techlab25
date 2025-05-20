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
    console.log('Registering module:', m.name);
    m.register(container);
  });
}

export { container, modules };
