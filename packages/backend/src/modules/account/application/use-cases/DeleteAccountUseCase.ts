import { inject, injectable } from 'inversify';

import { Result } from '../../../../core/application/Result';
import { IUnitOfWork } from '../../../../core/application/transactions/IUnitOfWork';
import {
  BusinessRuleViolationError,
  NotFoundError,
} from '../../../../core/domain/errors';
import { Id } from '../../../../core/domain/value-objects';
import { IAccountRepository } from '../../domain/repositories/IAccountRepository';
import { DeleteAccountDto } from '../dtos/DeleteAccountDto';

@injectable()
export class DeleteAccountUseCase {
  public constructor(
    @inject(Symbol.for('AccountRepository'))
    private readonly accountRepository: IAccountRepository,

    @inject(Symbol.for('UnitOfWork'))
    private readonly unitOfWork: IUnitOfWork,
  ) {}

  public async execute(input: DeleteAccountDto): Promise<Result<void>> {
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
              'Requesting user does not own the account',
            ),
          );
        }

        await this.accountRepository.delete(accountId, transactionId);

        return Result.ok();
      });
    } catch (error) {
      return Result.fail(
        new Error(
          `Failed to delete account: ${error instanceof Error ? error.message : String(error)}`,
        ),
      );
    }
  }
}
