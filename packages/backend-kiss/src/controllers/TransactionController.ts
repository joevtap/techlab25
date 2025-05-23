import { NextFunction, Request, Response, Router } from 'express';
import { inject, injectable } from 'inversify';

import {
  AddFundsSchema,
  ListTransactionsByAccountNumberSchema,
  TransferFundsSchema,
  WithdrawFundsSchema,
} from '../dtos';
import { AccountNumber, Id } from '../entities/types';
import { TOKENS } from '../infrastructure/Tokens';
import { TransactionService } from '../services/TransactionService';

@injectable()
export class TransactionController {
  private router: Router;

  constructor(
    @inject(TOKENS.TRANSACTION_SERVICE)
    private transactionService: TransactionService,
  ) {
    this.router = Router();
    this.initializeRoutes();
  }

  public getRouter(): Router {
    return this.router;
  }

  private initializeRoutes(): void {
    this.router.get(
      '/:account',
      this.listTransactionsByAccountNumber.bind(this),
    );
    this.router.post('/transfer', this.transferFunds.bind(this));
    this.router.post('/deposit', this.addFunds.bind(this));
    this.router.post('/withdraw', this.withdrawFunds.bind(this));
  }

  private async listTransactionsByAccountNumber(
    req: Request,
    res: Response,
    next: NextFunction,
  ): Promise<void> {
    try {
      const userId = req.user?.id as Id;
      const accountNumber = req.params.account as AccountNumber;

      const validatedData = ListTransactionsByAccountNumberSchema.parse({
        ...req.body,
        requestingUserId: userId,
        accountNumber: accountNumber,
      });

      const response =
        await this.transactionService.listTransactionsByAccountNumber(
          validatedData,
        );

      res.status(200).json(response);
    } catch (error) {
      next(error);
    }
  }

  private async transferFunds(
    req: Request,
    res: Response,
    next: NextFunction,
  ): Promise<void> {
    try {
      const userId = req.user?.id as Id;

      const validatedData = TransferFundsSchema.parse({
        ...req.body,
        requestingUserId: userId,
      });

      const response =
        await this.transactionService.transferFunds(validatedData);

      res.status(200).json(response);
    } catch (error) {
      next(error);
    }
  }

  private async addFunds(
    req: Request,
    res: Response,
    next: NextFunction,
  ): Promise<void> {
    try {
      const userId = req.user?.id as Id;

      const validatedData = AddFundsSchema.parse({
        ...req.body,
        requestingUserId: userId,
      });

      const response = await this.transactionService.addFunds(validatedData);

      res.status(200).json(response);
    } catch (error) {
      next(error);
    }
  }

  private async withdrawFunds(
    req: Request,
    res: Response,
    next: NextFunction,
  ): Promise<void> {
    try {
      const userId = req.user?.id as Id;

      const validatedData = WithdrawFundsSchema.parse({
        ...req.body,
        requestingUserId: userId,
      });

      const response =
        await this.transactionService.withdrawFunds(validatedData);

      res.status(200).json(response);
    } catch (error) {
      next(error);
    }
  }
}
