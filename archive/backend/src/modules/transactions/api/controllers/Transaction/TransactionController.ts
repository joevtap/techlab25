import { NextFunction, Request, Response, Router } from 'express';
import { inject, injectable } from 'inversify';

import { NotFoundError } from '../../../../../core/domain/errors';
import { AddFundsUseCase } from '../../../application/use-cases/AddFundsUseCase';
import { ListTransactionsByAccountUseCase } from '../../../application/use-cases/ListTransactionsByAccountUseCase';
import { TransferFundsByAccountNumberUseCase } from '../../../application/use-cases/TransferFundsByAccountNumberUseCase';
import { TransferFundsUseCase } from '../../../application/use-cases/TransferFundsUseCase';
import { WithdrawFundsUseCase } from '../../../application/use-cases/WithdrawFundsUseCase';
import { AddFundsValidator } from '../../validators/AddFundsValidator';
import { ListTransactionsValidator } from '../../validators/ListTransactionsValidator';
import { TransferFundsByAccountNumberValidator } from '../../validators/TransferFundsByAccountNumberValidator';
import { TransferFundsValidator } from '../../validators/TransferFundsValidator';
import { WithdrawFundsValidator } from '../../validators/WithdrawFundsValidator';

@injectable()
export class TransactionController {
  public readonly router: Router;

  public constructor(
    @inject(Symbol.for('AddFundsUseCase'))
    private readonly addFundsUseCase: AddFundsUseCase,

    @inject(Symbol.for('WithdrawFundsUseCase'))
    private readonly withdrawFundsUseCase: WithdrawFundsUseCase,

    @inject(Symbol.for('TransferFundsUseCase'))
    private readonly transferFundsUseCase: TransferFundsUseCase,

    @inject(Symbol.for('TransferFundsByAccountNumberUseCase'))
    private readonly transferFundsByAccountNumberUseCase: TransferFundsByAccountNumberUseCase,

    @inject(Symbol.for('ListTransactionsByAccountUseCase'))
    private readonly listTransactionsByAccountUseCase: ListTransactionsByAccountUseCase,
  ) {
    this.router = Router();
    this.bindRoutes();
  }

  private bindRoutes() {
    this.router.post('/add-funds', this.addFunds.bind(this));
    this.router.post('/withdraw', this.withdrawFunds.bind(this));
    this.router.post('/transfer', this.transferFunds.bind(this));
    this.router.post(
      '/transfer-by-account-number',
      this.transferFundsByAccountNumber.bind(this),
    );
    this.router.get('/account/:id', this.listTransactionsByAccount.bind(this));
  }

  public async addFunds(
    req: Request,
    res: Response,
    next: NextFunction,
  ): Promise<void> {
    try {
      const userId = req.user?.id as string;
      const validatedBody = AddFundsValidator.validate(req.body);

      const result = await this.addFundsUseCase.execute({
        accountId: validatedBody.accountId,
        amount: validatedBody.amount,
        description: validatedBody.description,
        requestingUserId: userId,
      });

      if (result.isFailure) {
        next(result.getError());
        return;
      }

      res.status(200).json({
        success: true,
        message: 'Funds added successfully',
      });
    } catch (error) {
      next(error);
    }
  }

  public async withdrawFunds(
    req: Request,
    res: Response,
    next: NextFunction,
  ): Promise<void> {
    try {
      const userId = req.user?.id as string;
      const validatedBody = WithdrawFundsValidator.validate(req.body);

      const result = await this.withdrawFundsUseCase.execute({
        accountId: validatedBody.accountId,
        amount: validatedBody.amount,
        description: validatedBody.description,
        requestingUserId: userId,
      });

      if (result.isFailure) {
        next(result.getError());
        return;
      }

      res.status(200).json({
        success: true,
        message: 'Funds withdrawn successfully',
      });
    } catch (error) {
      next(error);
    }
  }

  public async transferFunds(
    req: Request,
    res: Response,
    next: NextFunction,
  ): Promise<void> {
    try {
      const userId = req.user?.id as string;
      const validatedBody = TransferFundsValidator.validate(req.body);

      const result = await this.transferFundsUseCase.execute({
        sourceAccountId: validatedBody.sourceAccountId,
        targetAccountId: validatedBody.targetAccountId,
        amount: validatedBody.amount,
        description: validatedBody.description,
        requestingUserId: userId,
      });

      if (result.isFailure) {
        next(result.getError());
        return;
      }

      res.status(200).json({
        success: true,
        message: 'Funds transferred successfully',
      });
    } catch (error) {
      next(error);
    }
  }

  public async transferFundsByAccountNumber(
    req: Request,
    res: Response,
    next: NextFunction,
  ): Promise<void> {
    try {
      const userId = req.user?.id as string;
      const validatedBody = TransferFundsByAccountNumberValidator.validate(
        req.body,
      );

      const result = await this.transferFundsByAccountNumberUseCase.execute({
        sourceAccountNumber: validatedBody.sourceAccountNumber,
        targetAccountNumber: validatedBody.targetAccountNumber,
        amount: validatedBody.amount,
        description: validatedBody.description,
        requestingUserId: userId,
      });

      if (result.isFailure) {
        next(result.getError());
        return;
      }

      res.status(200).json({
        success: true,
        message: 'Funds transferred successfully',
      });
    } catch (error) {
      next(error);
    }
  }

  public async listTransactionsByAccount(
    req: Request,
    res: Response,
    next: NextFunction,
  ): Promise<void> {
    try {
      const userId = req.user?.id as string;
      const accountId = req.params?.id as string;

      if (!accountId) {
        throw new NotFoundError('Account', accountId ?? 'NULL');
      }

      // Query params for date filtering
      const query = ListTransactionsValidator.validate({
        startDate: req.query.startDate as string | undefined,
        endDate: req.query.endDate as string | undefined,
      });

      const result = await this.listTransactionsByAccountUseCase.execute({
        accountId,
        startDate: query.startDate,
        endDate: query.endDate,
        requestingUserId: userId,
      });

      if (result.isFailure) {
        next(result.getError());
        return;
      }

      const transactions = result.getValue();

      if (transactions.transactions.length === 0) {
        res.status(204).json(transactions);
        return;
      }

      res.status(200).json(transactions);
    } catch (error) {
      next(error);
    }
  }
}
