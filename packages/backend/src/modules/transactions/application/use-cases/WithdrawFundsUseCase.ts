// filepath: /home/jovi/www/techlab25/packages/backend/src/modules/transactions/application/use-cases/WithdrawFundsUseCase.ts
import { inject, injectable } from 'inversify';

import { Result } from '../../../../core/application/Result';
import { IUnitOfWork } from '../../../../core/application/transactions/IUnitOfWork';
import {
  BusinessRuleViolationError,
  NotFoundError,
  ValidationError,
} from '../../../../core/domain/errors';
import { IIdGenerator } from '../../../../core/domain/services/IIdGenerator';
import { Id } from '../../../../core/domain/value-objects';
import { InsufficientFundsError } from '../../../account/domain/errors/InsufficientFundsError';
import { IAccountRepository } from '../../../account/domain/repositories/IAccountRepository';
import { Currency } from '../../../account/domain/value-objects/Currency';
import { Transaction } from '../../domain/entities/Transaction';
import { ITransactionRepository } from '../../domain/repositories/ITransactionRepository';
import { Description } from '../../domain/value-objects/Description';
import { TransactionDate } from '../../domain/value-objects/TransactionDate';
import { TransactionValue } from '../../domain/value-objects/TransactionValue';
import { WithdrawFundsDto } from '../dtos/WithdrawFundsDto';

@injectable()
export class WithdrawFundsUseCase {
  public constructor(
    @inject(Symbol.for('AccountRepository'))
    private readonly accountRepository: IAccountRepository,

    @inject(Symbol.for('TransactionRepository'))
    private readonly transactionRepository: ITransactionRepository,

    @inject(Symbol.for('IdGenerator'))
    private readonly idGenerator: IIdGenerator,

    @inject(Symbol.for('UnitOfWork'))
    private readonly unitOfWork: IUnitOfWork,
  ) {}

  public async execute(input: WithdrawFundsDto): Promise<Result<void>> {
    try {
      return await this.unitOfWork.runInTransaction(async (transactionId) => {
        const accountId = new Id(input.accountId);
        const requestingUserId = new Id(input.requestingUserId);

        const account = await this.accountRepository.findById(
          accountId,
          transactionId,
        );

        if (!account) {
          return Result.fail(
            new NotFoundError('Account', accountId.toString()),
          );
        }

        if (!account.ownerId.equals(requestingUserId)) {
          return Result.fail(
            new BusinessRuleViolationError(
              'User does not have permission to withdraw funds from this account',
            ),
          );
        }

        if (input.amount <= 0) {
          return Result.fail(
            new BusinessRuleViolationError('Amount must be positive'),
          );
        }

        try {
          const transactionId1 = new Id(this.idGenerator.generate());
          const value = new TransactionValue(input.amount);
          const createdAt = new TransactionDate(new Date());
          const description = input.description
            ? new Description(input.description)
            : undefined;

          const transaction = Transaction.debit({
            id: transactionId1,
            fromId: accountId,
            value,
            description,
            createdAt,
          });

          const updatedAccount = account.withdraw(new Currency(input.amount));

          await this.transactionRepository.save(transaction, transactionId);
          await this.accountRepository.save(updatedAccount, transactionId);

          return Result.ok();
        } catch (error) {
          if (error instanceof InsufficientFundsError) {
            return Result.fail(error);
          }
          throw error;
        }
      });
    } catch (error) {
      if (error instanceof ValidationError) {
        return Result.fail(error);
      } else if (error instanceof BusinessRuleViolationError) {
        return Result.fail(error);
      } else if (error instanceof InsufficientFundsError) {
        return Result.fail(error);
      }

      return Result.fail(
        new Error(
          `Failed to withdraw funds: ${error instanceof Error ? error.message : String(error)}`,
        ),
      );
    }
  }
}
