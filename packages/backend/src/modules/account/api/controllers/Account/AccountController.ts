import { NextFunction, Request, Response, Router } from 'express';
import { inject, injectable } from 'inversify';

import { CreateAccountUseCase } from '../../../application/use-cases/CreateAccountUseCase';
import { DeleteAccountUseCase } from '../../../application/use-cases/DeleteAccountUseCase';
import { GetUserAccountsUseCase } from '../../../application/use-cases/GetUserAccountsUseCase';
import { UpdateAccountUseCase } from '../../../application/use-cases/UpdateAccountUseCase';

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
    // this.router.post('/create');
    // this.router.put('/update/:id');
    // this.router.delete('/delete/:id');
  }

  public async getUserAccounts(
    req: Request,
    res: Response,
    next: NextFunction,
  ): Promise<void> {
    try {
      if (req.user) {
        const id = req.user.id as string;

        const result = await this.getUserAccountsUseCase.execute(id);

        if (result.isFailure) {
          next(result.getError());
          return;
        }

        const accounts = result.getValue();

        res.status(200).json({
          accounts,
        });

        return;
      }
    } catch (error) {
      next(error);
    }
  }
}
