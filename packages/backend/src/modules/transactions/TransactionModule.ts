import { Container } from 'inversify';

import { Module } from '../../core/application/Module';

import { TransactionController } from './api/controllers/Transaction/TransactionController';
import { AddFundsUseCase } from './application/use-cases/AddFundsUseCase';
import { ListTransactionsByAccountUseCase } from './application/use-cases/ListTransactionsByAccountUseCase';
import { TransferFundsByAccountNumberUseCase } from './application/use-cases/TransferFundsByAccountNumberUseCase';
import { TransferFundsUseCase } from './application/use-cases/TransferFundsUseCase';
import { WithdrawFundsUseCase } from './application/use-cases/WithdrawFundsUseCase';
import { ITransactionRepository } from './domain/repositories/ITransactionRepository';
import { TypeOrmTransactionRepository } from './infrastructure/repositories/TypeOrmTransactionRepository';

export class TransactionModule extends Module {
  public readonly name = 'transactions';

  public register(container: Container) {
    container
      .bind<ITransactionRepository>(Symbol.for('TransactionRepository'))
      .to(TypeOrmTransactionRepository);

    container
      .bind<AddFundsUseCase>(Symbol.for('AddFundsUseCase'))
      .to(AddFundsUseCase);

    container
      .bind<WithdrawFundsUseCase>(Symbol.for('WithdrawFundsUseCase'))
      .to(WithdrawFundsUseCase);

    container
      .bind<TransferFundsUseCase>(Symbol.for('TransferFundsUseCase'))
      .to(TransferFundsUseCase);

    container
      .bind<TransferFundsByAccountNumberUseCase>(
        Symbol.for('TransferFundsByAccountNumberUseCase'),
      )
      .to(TransferFundsByAccountNumberUseCase);

    container
      .bind<ListTransactionsByAccountUseCase>(
        Symbol.for('ListTransactionsByAccountUseCase'),
      )
      .to(ListTransactionsByAccountUseCase);

    container
      .bind<TransactionController>(Symbol.for('TransactionController'))
      .to(TransactionController);
  }

  public routers(container: Container) {
    const transactionController = container.get<TransactionController>(
      Symbol.for('TransactionController'),
    );

    return [
      {
        path: '/',
        router: transactionController.router,
        authRequired: true,
      },
    ];
  }
}
