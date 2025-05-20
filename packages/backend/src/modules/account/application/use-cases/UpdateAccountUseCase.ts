import { inject, injectable } from 'inversify';

import { Result } from '../../../../core/application/Result';
import { IUnitOfWork } from '../../../../core/application/transactions/IUnitOfWork';
import {
  BusinessRuleViolationError,
  NotFoundError,
} from '../../../../core/domain/errors';
import { Id } from '../../../../core/domain/value-objects';
import { IAccountRepository } from '../../domain/repositories/IAccountRepository';
import { AccountType } from '../../domain/value-objects/AccountType';
import { UpdateAccountDto } from '../dtos/UpdateAccountDto';

@injectable()
export class UpdateAccountUseCase {
  public constructor(
    @inject(Symbol.for('AccountRepository'))
    private readonly accountRepository: IAccountRepository,

    @inject(Symbol.for('UnitOfWork'))
    private readonly unitOfWork: IUnitOfWork,
  ) {}

  public async execute(input: UpdateAccountDto): Promise<Result<void>> {
    try {
      return await this.unitOfWork.runInTransaction(async (transactionId) => {
        const id = new Id(input.id);
        const type = new AccountType(input.type);
        const requestingUserId = new Id(input.requestingUserId);

        const account = await this.accountRepository.findById(
          id,
          transactionId,
        );

        if (!account) {
          return Result.fail(new NotFoundError('Account does not exist'));
        }

        if (!account.ownerId.equals(requestingUserId)) {
          return Result.fail(
            new BusinessRuleViolationError(
              'Requesting user does not own the account',
            ),
          );
        }

        await this.accountRepository.update({
          id,
          type,
        });

        return Result.ok();
      });
    } catch (error) {
      return Result.fail(
        new Error(
          `Failed to update account: ${error instanceof Error ? error.message : String(error)}`,
        ),
      );
    }
  }
}
