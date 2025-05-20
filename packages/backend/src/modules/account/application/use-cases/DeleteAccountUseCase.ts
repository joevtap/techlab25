import { inject, injectable } from 'inversify';

import { Result } from '../../../../core/application/Result';
import { BusinessRuleViolationError } from '../../../../core/domain/errors';
import { Id } from '../../../../core/domain/value-objects';
import { IAccountRepository } from '../../domain/repositories/IAccountRepository';
import { DeleteAccountDto } from '../dtos/DeleteAccountDto';

@injectable()
export class DeleteAccountUseCase {
  public constructor(
    @inject(Symbol.for('AccountRepository'))
    private readonly accountRepository: IAccountRepository,
  ) {}

  public async execute(input: DeleteAccountDto): Promise<Result<void>> {
    try {
      const accountId = new Id(input.accountId);
      const requestingUserId = new Id(input.requestingUserId);

      if (!requestingUserId.equals(accountId)) {
        return Result.fail(
          new BusinessRuleViolationError(
            'User cannot delete an account they do not own',
          ),
        );
      }

      await this.accountRepository.delete(accountId);

      return Result.ok();
    } catch (error) {
      return Result.fail(
        new Error(
          `Failed to delete account: ${error instanceof Error ? error.message : String(error)}`,
        ),
      );
    }
  }
}
