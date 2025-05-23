import { NextFunction, Request, Response, Router } from 'express';
import { inject, injectable } from 'inversify';

import {
  CreateAccountSchema,
  DeleteAccountSchema,
  ListUserAccountsSchema,
  UpdateAccountSchema,
} from '../dtos';
import { Id } from '../entities/types';
import { TOKENS } from '../infrastructure/Tokens';
import { AccountService } from '../services/AccountService';

@injectable()
export class AccountController {
  private router: Router;

  constructor(
    @inject(TOKENS.ACCOUNT_SERVICE) private accountService: AccountService,
  ) {
    this.router = Router();
    this.initializeRoutes();
  }

  public getRouter(): Router {
    return this.router;
  }

  private initializeRoutes(): void {
    this.router.get('/all', this.listUserAccounts.bind(this));
    this.router.post('/create', this.createAccount.bind(this));
    this.router.patch('/update/:id', this.updateAccount.bind(this));
    this.router.delete('/delete/:id', this.deleteAccount.bind(this));
  }

  private async listUserAccounts(
    req: Request,
    res: Response,
    next: NextFunction,
  ): Promise<void> {
    try {
      const userId = req.user?.id as Id;

      const validatedData = ListUserAccountsSchema.parse({
        ownerId: userId,
        requestingUserId: userId,
      });

      const response =
        await this.accountService.listUserAccounts(validatedData);

      res.status(200).json(response);
    } catch (error) {
      next(error);
    }
  }

  private async createAccount(
    req: Request,
    res: Response,
    next: NextFunction,
  ): Promise<void> {
    try {
      const userId = req.user?.id as Id;

      const validatedData = CreateAccountSchema.parse({
        ...req.body,
        ownerId: userId,
        requestingUserId: userId,
      });

      const response = await this.accountService.createAccount(validatedData);

      res.status(201).json(response);
    } catch (error) {
      next(error);
    }
  }

  private async updateAccount(
    req: Request,
    res: Response,
    next: NextFunction,
  ): Promise<void> {
    try {
      const userId = req.user?.id as Id;
      const accountId = req.params.id as Id;

      const validatedData = UpdateAccountSchema.parse({
        ...req.body,
        id: accountId,
        requestingUserId: userId,
      });

      const response = await this.accountService.updateAccount(validatedData);

      res.status(200).json(response);
    } catch (error) {
      next(error);
    }
  }

  private async deleteAccount(
    req: Request,
    res: Response,
    next: NextFunction,
  ): Promise<void> {
    try {
      const userId = req.user?.id as Id;
      const accountId = req.params.id as Id;

      const validatedData = DeleteAccountSchema.parse({
        accountId,
        requestingUserId: userId,
      });

      const response = await this.accountService.deleteAccount(validatedData);

      res.status(200).json(response);
    } catch (error) {
      next(error);
    }
  }
}
