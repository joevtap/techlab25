import { Express } from 'express';

import { UserController } from './controllers';
import { AccountController } from './controllers/AccountController';
import { TransactionController } from './controllers/TransactionController';
import { IoC } from './infrastructure/IoC';
import { TOKENS } from './infrastructure/Tokens';
import { authenticate } from './middleware/authentication';

export function registerRoutes(app: Express): void {
  registerApiRoutes(app);
  registerSystemRoutes(app);
}

function registerApiRoutes(app: Express): void {
  const userController = IoC.container.get<UserController>(
    TOKENS.USER_CONTROLLER,
  );
  const accountControler = IoC.container.get<AccountController>(
    TOKENS.ACCOUNT_CONTROLLER,
  );
  const transactionController = IoC.container.get<TransactionController>(
    TOKENS.TRANSACTION_CONTROLLER,
  );

  app.use('/user', userController.getRouter());
  app.use('/accounts', authenticate, accountControler.getRouter());
  app.use('/transactions', authenticate, transactionController.getRouter());
}

function registerSystemRoutes(app: Express): void {
  app.get('/health', (req, res) => {
    res.status(200).send();
  });
}
