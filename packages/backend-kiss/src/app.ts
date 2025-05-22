import cors from 'cors';
import express, { Request, Response } from 'express';
import helmet from 'helmet';
import morgan from 'morgan';
import { z } from 'zod/v4';

import { IoC } from './infrastructure/IoC';
import { TypeOrmDataSource } from './infrastructure/orm';
import { errorHandler } from './middleware/errorHandler';
import { validate } from './middleware/validate';

export async function main() {
  await TypeOrmDataSource.initialize();
  IoC.initialize();

  const app = express();

  app.use(cors({ origin: '*' }));
  app.use(helmet());
  app.use(morgan('tiny'));

  app.use(express.json());

  app.route('/teste').get(
    validate(
      z.object({
        email: z.email().min(10),
      }),
    ),
    (req: Request, res: Response) => {
      console.log(req.body);

      res.status(200).send();
      return;
    },
  );

  app.use(errorHandler);

  app.listen(8080, () => {
    console.log('Server is listening on port 8080');
  });
}
