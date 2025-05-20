import { inject, injectable } from 'inversify';

import { Result } from '../../../../core/application/Result';
import { Id } from '../../../../core/domain/value-objects';
import { IAccountRepository } from '../../domain/repositories/IAccountRepository';

@injectable()
export class GetUserAccountsUseCase {
  public constructor(
    @inject(Symbol.for('AccountRepository'))
    private readonly accountRepository: IAccountRepository,
  ) {}

  public async execute(accountOwnerId: string): Promise<Result<unknown>> {
    try {
      const id = new Id(accountOwnerId);

      const accounts = await this.accountRepository.findAllByOwnerId(id);

      if (accounts) {
        return Result.ok(accounts);
      }

      return Result.ok([]);
    } catch (error) {
      return Result.fail(
        new Error(
          `Failed to get user accounts: ${error instanceof Error ? error.message : String(error)}`,
        ),
      );
    }
  }
}
