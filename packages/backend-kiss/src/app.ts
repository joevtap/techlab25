import cors from 'cors';
import express, { Express } from 'express';
import helmet from 'helmet';
import morgan from 'morgan';

import { IoC } from './infrastructure/IoC';
import { TypeOrmDataSource } from './infrastructure/orm';
import { errorHandler } from './middleware/errorHandler';
import { registerRoutes } from './routes';

export async function createApp(): Promise<Express> {
  await TypeOrmDataSource.initialize();
  IoC.initialize();

  const app = express();

  setupMiddleware(app);

  registerRoutes(app);

  app.use(errorHandler);

  return app;
}

function setupMiddleware(app: Express): void {
  app.use(cors({ origin: '*' }));
  app.use(helmet());
  app.use(morgan('tiny'));
  app.use(express.json());
}
