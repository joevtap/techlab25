import { Container } from 'inversify';

import { Module } from '../../core/application/Module';

import { AccountController } from './api/controllers/Account/AccountController';
import { CreateAccountUseCase } from './application/use-cases/CreateAccountUseCase';
import { DeleteAccountUseCase } from './application/use-cases/DeleteAccountUseCase';
import { GetUserAccountsUseCase } from './application/use-cases/GetUserAccountsUseCase';
import { UpdateAccountUseCase } from './application/use-cases/UpdateAccountUseCase';
import { IAccountRepository } from './domain/repositories/IAccountRepository';
import { TypeOrmAccountRepository } from './infrastructure/repositories/TypeOrmAccountRepository';

export class AccountModule extends Module {
  public readonly name = 'accounts';

  public register(container: Container) {
    container
      .bind<IAccountRepository>(Symbol.for('AccountRepository'))
      .to(TypeOrmAccountRepository);

    container
      .bind<CreateAccountUseCase>(Symbol.for('CreateAccountUseCase'))
      .to(CreateAccountUseCase);

    container
      .bind<GetUserAccountsUseCase>(Symbol.for('GetUserAccountsUseCase'))
      .to(GetUserAccountsUseCase);

    container
      .bind<UpdateAccountUseCase>(Symbol.for('UpdateAccountUseCase'))
      .to(UpdateAccountUseCase);

    container
      .bind<DeleteAccountUseCase>(Symbol.for('DeleteAccountUseCase'))
      .to(DeleteAccountUseCase);

    container
      .bind<AccountController>(Symbol.for('AccountController'))
      .to(AccountController);
  }

  public routers(container: Container) {
    const accountController = container.get<AccountController>(
      Symbol.for('AccountController'),
    );

    return [
      {
        path: '/',
        router: accountController.router,
        authRequired: true,
      },
    ];
  }
}
