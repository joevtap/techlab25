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
import { TransferFundsDto } from '../dtos/TransferFundsDto';

@injectable()
export class TransferFundsUseCase {
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

  public async execute(input: TransferFundsDto): Promise<Result<void>> {
    try {
      return await this.unitOfWork.runInTransaction(async (transactionId) => {
        const sourceAccountId = new Id(input.sourceAccountId);
        const targetAccountId = new Id(input.targetAccountId);
        const requestingUserId = new Id(input.requestingUserId);

        // Validate source account
        const sourceAccount = await this.accountRepository.findById(
          sourceAccountId,
          transactionId,
        );

        if (!sourceAccount) {
          return Result.fail(
            new NotFoundError('Source Account', sourceAccountId.toString()),
          );
        }

        if (!sourceAccount.ownerId.equals(requestingUserId)) {
          return Result.fail(
            new BusinessRuleViolationError(
              'User does not have permission to transfer funds from this account',
            ),
          );
        }

        // Validate target account
        const targetAccount = await this.accountRepository.findById(
          targetAccountId,
          transactionId,
        );

        if (!targetAccount) {
          return Result.fail(
            new NotFoundError('Target Account', targetAccountId.toString()),
          );
        }

        // Validate amount
        if (input.amount <= 0) {
          return Result.fail(
            new BusinessRuleViolationError('Amount must be positive'),
          );
        }

        // Cannot transfer to the same account
        if (sourceAccountId.equals(targetAccountId)) {
          return Result.fail(
            new BusinessRuleViolationError(
              'Cannot transfer to the same account',
            ),
          );
        }

        try {
          const transactionId1 = new Id(this.idGenerator.generate());
          const value = new TransactionValue(input.amount);
          const createdAt = new TransactionDate(new Date());
          const description = input.description
            ? new Description(input.description)
            : undefined;

          // Create transfer transaction
          const transaction = Transaction.transfer({
            id: transactionId1,
            fromId: sourceAccountId,
            toId: targetAccountId,
            value,
            description,
            createdAt,
          });

          // Update source account (withdraw)
          const updatedSourceAccount = sourceAccount.withdraw(
            new Currency(input.amount),
          );

          // Update target account (deposit)
          const updatedTargetAccount = targetAccount.deposit(
            new Currency(input.amount),
          );

          // Save transaction and updated accounts
          await this.transactionRepository.save(transaction, transactionId);
          await this.accountRepository.save(
            updatedSourceAccount,
            transactionId,
          );
          await this.accountRepository.save(
            updatedTargetAccount,
            transactionId,
          );

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
          `Failed to transfer funds: ${error instanceof Error ? error.message : String(error)}`,
        ),
      );
    }
  }
}
