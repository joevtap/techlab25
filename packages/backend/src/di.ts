import { Container } from 'inversify';

import { Module } from './core/application/Module';
import { AuthModule } from './modules/auth/AuthModule';

const container = new Container({ defaultScope: 'Request' });

const modules: Module[] = [new AuthModule()];

export async function initializeDiContainer() {
  modules.forEach((m) => {
    console.log('Registering module:', m.name);
    m.register(container);
  });
}

export { container, modules };
