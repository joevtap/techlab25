import { inject, injectable } from 'inversify';

import { Result } from '../../../../core/application/Result';
import { IUnitOfWork } from '../../../../core/application/transactions/IUnitOfWork';
import {
  BusinessRuleViolationError,
  ValidationError,
} from '../../../../core/domain/errors';
import { IIdGenerator } from '../../../../core/domain/services/IIdGenerator';
import { Id } from '../../../../core/domain/value-objects';
import { IUserRepository } from '../../../auth/domain/repositories/IUserRepository';
import { Account } from '../../domain/entities/Account';
import { IAccountRepository } from '../../domain/repositories/IAccountRepository';
import { AccountNumber } from '../../domain/value-objects/AccountNumber';
import { AccountType } from '../../domain/value-objects/AccountType';
import { Balance } from '../../domain/value-objects/Balance';
import { CreateAccountDto } from '../dtos/CreateAccountDto';
import { CreateAccountOutputDto } from '../dtos/CreateAccountOutputDto';

@injectable()
export class CreateAccountUseCase {
  public constructor(
    @inject(Symbol.for('AccountRepository'))
    private accountRepository: IAccountRepository,

    @inject(Symbol.for('UserRepository'))
    private userRepository: IUserRepository,

    @inject(Symbol.for('IdGenerator'))
    private idGenerator: IIdGenerator,

    @inject(Symbol.for('UnitOfWork'))
    private unitOfWork: IUnitOfWork,
  ) {}

  public async execute(
    input: CreateAccountDto,
  ): Promise<Result<CreateAccountOutputDto>> {
    try {
      return await this.unitOfWork.runInTransaction(async (transactionId) => {
        const id = new Id(this.idGenerator.generate());
        const accountNumber = new AccountNumber(input.accountNumber);
        const type = new AccountType(input.type);
        const balance = new Balance(input.balance);
        const ownerId = new Id(input.ownerId);

        const userExists = await this.userRepository.findById(
          ownerId,
          transactionId,
        );

        if (!userExists) {
          return Result.fail(
            new BusinessRuleViolationError('Account owner does not exist'),
          );
        }

        const existingAccountNumber =
          await this.accountRepository.findByAccountNumber(
            accountNumber,
            transactionId,
          );

        if (existingAccountNumber) {
          return Result.fail(
            new BusinessRuleViolationError(
              'Account with this account number already exists',
            ),
          );
        }

        const account = Account.create({
          id,
          accountNumber,
          type,
          balance,
          ownerId,
        });

        await this.accountRepository.save(account, transactionId);

        return Result.ok({
          id: id.toString(),
          accountNumber: accountNumber.toString(),
          type: type.toString(),
          balance: balance.getValue(),
          ownerId: ownerId.toString(),
        });
      });
    } catch (error) {
      if (error instanceof ValidationError) {
        return Result.fail(error);
      } else if (error instanceof BusinessRuleViolationError) {
        return Result.fail(error);
      }

      return Result.fail(
        new Error(
          `Failed to create user: ${error instanceof Error ? error.message : String(error)}`,
        ),
      );
    }
  }
}
