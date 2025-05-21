import { inject, injectable } from 'inversify';

import { Result } from '../../../../core/application/Result';
import {
  BusinessRuleViolationError,
  NotFoundError,
} from '../../../../core/domain/errors';
import { Id } from '../../../../core/domain/value-objects';
import { IAccountRepository } from '../../../account/domain/repositories/IAccountRepository';
import { Transaction } from '../../domain/entities/Transaction';
import { ITransactionRepository } from '../../domain/repositories/ITransactionRepository';
import { TransactionDate } from '../../domain/value-objects/TransactionDate';
import { ListTransactionsByAccountDto } from '../dtos/ListTransactionsByAccountDto';
import { ListTransactionsResponseDto } from '../dtos/TransactionDto';
import { TransactionMapper } from '../mappers/TransactionMapper';

@injectable()
export class ListTransactionsByAccountUseCase {
  public constructor(
    @inject(Symbol.for('AccountRepository'))
    private readonly accountRepository: IAccountRepository,

    @inject(Symbol.for('TransactionRepository'))
    private readonly transactionRepository: ITransactionRepository,
  ) {}

  public async execute(
    input: ListTransactionsByAccountDto,
  ): Promise<Result<ListTransactionsResponseDto>> {
    try {
      const accountId = new Id(input.accountId);
      const requestingUserId = new Id(input.requestingUserId);

      // Verify that account exists
      const account = await this.accountRepository.findById(accountId);

      if (!account) {
        return Result.fail(new NotFoundError('Account', accountId.toString()));
      }

      // Verify that requesting user is the owner of the account
      if (!account.ownerId.equals(requestingUserId)) {
        return Result.fail(
          new BusinessRuleViolationError(
            'User does not have permission to view transactions for this account',
          ),
        );
      }

      let transactions: Transaction[];

      // If date range is provided, filter by date range
      if (input.startDate && input.endDate) {
        const startDate = new TransactionDate(new Date(input.startDate));
        const endDate = new TransactionDate(new Date(input.endDate));

        transactions =
          await this.transactionRepository.listByAccountIdAndPeriod(
            accountId,
            startDate,
            endDate,
          );
      } else {
        // Otherwise, get all transactions for the account
        transactions =
          await this.transactionRepository.listByAccountId(accountId);
      }

      // Map transactions to DTOs
      return Result.ok(TransactionMapper.toDtoList(transactions));
    } catch (error) {
      return Result.fail(
        new Error(
          `Failed to list transactions: ${error instanceof Error ? error.message : String(error)}`,
        ),
      );
    }
  }
}
