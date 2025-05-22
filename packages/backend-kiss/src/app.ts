import cors from 'cors';
import express from 'express';
import helmet from 'helmet';
import morgan from 'morgan';

import { IoC } from './infrastructure/IoC';
import { TypeOrmDataSource } from './infrastructure/orm';
import { errorHandler } from './middleware/errorHandler';

export async function main() {
  await TypeOrmDataSource.initialize();
  IoC.initialize();

  const app = express();

  app.use(cors({ origin: '*' }));
  app.use(helmet());
  app.use(morgan('tiny'));

  app.use(express.json());

  app.use(errorHandler);

  app.listen(8080, () => {
    console.log('Server is listening on port 8080');
  });
}
