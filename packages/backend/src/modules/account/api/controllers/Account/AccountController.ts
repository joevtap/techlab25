import { NextFunction, Request, Response, Router } from 'express';
import { inject, injectable } from 'inversify';
import { nanoid } from 'nanoid';

import { NotFoundError } from '../../../../../core/domain/errors';
import { CreateAccountUseCase } from '../../../application/use-cases/CreateAccountUseCase';
import { DeleteAccountUseCase } from '../../../application/use-cases/DeleteAccountUseCase';
import { GetUserAccountsUseCase } from '../../../application/use-cases/GetUserAccountsUseCase';
import { UpdateAccountUseCase } from '../../../application/use-cases/UpdateAccountUseCase';
import { CreateAccountValidator } from '../../validators/CreateAccountValidator';
import { UpdateAccountValidator } from '../../validators/UpdateAccountValidator';

@injectable()
export class AccountController {
  public readonly router: Router;

  public constructor(
    @inject(Symbol.for('CreateAccountUseCase'))
    private readonly createAccountUseCase: CreateAccountUseCase,

    @inject(Symbol.for('UpdateAccountUseCase'))
    private readonly updateAccountUseCase: UpdateAccountUseCase,

    @inject(Symbol.for('DeleteAccountUseCase'))
    private readonly deleteAccountUseCase: DeleteAccountUseCase,

    @inject(Symbol.for('GetUserAccountsUseCase'))
    private readonly getUserAccountsUseCase: GetUserAccountsUseCase,
  ) {
    this.router = Router();
    this.bindRoutes();
  }

  private bindRoutes() {
    this.router.get('/all', this.getUserAccounts.bind(this));
    this.router.post('/create', this.createAccount.bind(this));
    this.router.put('/update/:id', this.updateAccount.bind(this));
    this.router.delete('/delete/:id', this.deleteAccount.bind(this));
  }

  public async getUserAccounts(
    req: Request,
    res: Response,
    next: NextFunction,
  ): Promise<void> {
    try {
      const userId = req.user?.id as string;

      const result = await this.getUserAccountsUseCase.execute(userId);

      if (result.isFailure) {
        next(result.getError());
        return;
      }

      const accounts = result.getValue();

      if (accounts.accounts.length === 0) {
        res.status(204).json(accounts);
        return;
      }

      res.status(200).json(accounts);
      return;
    } catch (error) {
      next(error);
    }
  }

  public async createAccount(
    req: Request,
    res: Response,
    next: NextFunction,
  ): Promise<void> {
    try {
      const userId = req.user?.id as string;

      const validatedBody = CreateAccountValidator.validate(req.body);

      const result = await this.createAccountUseCase.execute({
        accountNumber: nanoid(8),
        type: validatedBody.type,
        balance: validatedBody.balance ?? 0,
        ownerId: userId,
        requestingUserId: userId,
      });

      if (result.isFailure) {
        next(result.getError());
        return;
      }

      res.status(201).json({
        id: result.getValue().id,
        accountNumber: result.getValue().accountNumber,
      });
    } catch (error) {
      next(error);
    }
  }

  public async updateAccount(
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

      const validatedBody = UpdateAccountValidator.validate(req.body);

      const result = await this.updateAccountUseCase.execute({
        id: accountId,
        requestingUserId: userId,
        type: validatedBody.type,
      });

      if (result.isFailure) {
        next(result.getError());
        return;
      }

      res.status(200).json({
        id: accountId,
      });
      return;
    } catch (error) {
      next(error);
    }
  }

  public async deleteAccount(
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

      const result = await this.deleteAccountUseCase.execute({
        accountId: accountId,
        requestingUserId: userId,
      });

      if (result.isFailure) {
        next(result.getError());
        return;
      }

      res.status(200).send();
      return;
    } catch (error) {
      next(error);
    }
  }
}
