import { exit } from 'process';

import cors from 'cors';
import express from 'express';

import { container, initializeDiContainer, modules } from './di';
import { applicationDataSource } from './infrastructure/orm/data-source';

export async function main() {
  try {
    await applicationDataSource.initialize();
    console.log('Database initialized');

    await initializeDiContainer();
    console.log('DI container initialized');

    const app = express();

    app.use(cors({ origin: '*' }));
    app.use(express.json());

    modules.forEach((m) => {
      const base = m.name;

      m.routers(container).forEach(({ path, router }) => {
        app.use(`/${base}${path && path}`, router);
      });
    });

    app.listen(3000, () => {
      console.log('Server running on port 3000');
    });
  } catch (error) {
    console.error('Failed to start application:', error);
    exit(1);
  }
}

main();
