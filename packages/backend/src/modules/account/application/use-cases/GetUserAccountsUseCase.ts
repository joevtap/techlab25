import { inject, injectable } from 'inversify';

import { Result } from '../../../../core/application/Result';
import { Id } from '../../../../core/domain/value-objects';
import { IAccountRepository } from '../../domain/repositories/IAccountRepository';
import { AccountMapper } from '../../infrastructure/mappers/account/AccountMapper';
import { AccountsDto } from '../dtos/AccountsDto';

@injectable()
export class GetUserAccountsUseCase {
  public constructor(
    @inject(Symbol.for('AccountRepository'))
    private readonly accountRepository: IAccountRepository,
  ) {}

  public async execute(accountOwnerId: string): Promise<Result<AccountsDto>> {
    try {
      const id = new Id(accountOwnerId);

      const accounts = await this.accountRepository.findAllByOwnerId(id);

      if (accounts) {
        const response = AccountMapper.mapToDto(accounts);

        return Result.ok(response);
      }

      return Result.ok({ accounts: [] });
    } catch (error) {
      return Result.fail(
        new Error(
          `Failed to get user accounts: ${error instanceof Error ? error.message : String(error)}`,
        ),
      );
    }
  }
}
