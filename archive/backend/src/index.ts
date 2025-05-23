import { exit } from 'process';

import cors from 'cors';
import express from 'express';
import helmet from 'helmet';
import morgan from 'morgan';

import { errorHandler } from './core/api/middleware/error';
import { container, initializeDiContainer, modules } from './di';
import { applicationDataSource } from './infrastructure/orm/data-source';
import { authenticate } from './modules/auth/api/middleware/authenticate';

export async function main() {
  try {
    await applicationDataSource.initialize();
    console.log('Database initialized');

    await initializeDiContainer();
    console.log('DI container initialized');

    const app = express();

    app.use(cors({ origin: '*' }));
    app.use(helmet());
    app.use(morgan('tiny'));
    app.use(express.json());

    modules.forEach((m) => {
      const base = m.name;

      m.routers(container).forEach(({ path, router, authRequired }) => {
        if (authRequired) {
          app.use(`/${base}${path}`, authenticate, router);
          return;
        }

        app.use(`/${base}${path}`, router);
      });
    });

    app.use(errorHandler);

    const port = process.env.APP_PORT ?? 8080;
    app.listen(port, () => {
      console.log(`Server listening on port :${port}`);
    });
  } catch (error) {
    console.error('Failed to start application:', error);
    exit(1);
  }
}

main();
