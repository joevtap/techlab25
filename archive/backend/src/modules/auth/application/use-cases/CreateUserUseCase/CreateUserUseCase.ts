import { inject, injectable } from 'inversify';

import { Result } from '../../../../../core/application/Result';
import { IUnitOfWork } from '../../../../../core/application/transactions/IUnitOfWork';
import {
  BusinessRuleViolationError,
  ValidationError,
} from '../../../../../core/domain/errors';
import { IIdGenerator } from '../../../../../core/domain/services/IIdGenerator';
import { Id, Email, Username } from '../../../../../core/domain/value-objects';
import { User } from '../../../domain/entities/User';
import { UserAlreadyExistsError } from '../../../domain/errors/UserAlreadyExistsError';
import { IUserRepository } from '../../../domain/repositories/IUserRepository';
import { IPasswordHasher } from '../../../domain/services/IPasswordHasher';
import { HashedPassword } from '../../../domain/value-objects';
import { CreateUserDto } from '../../dtos/CreateUserDto';

type CreateUserOutput = {
  userId: string;
};

@injectable()
export class CreateUserUseCase {
  public constructor(
    @inject(Symbol.for('UserRepository'))
    private userRepository: IUserRepository,

    @inject(Symbol.for('IdGenerator'))
    private idGenerator: IIdGenerator,

    @inject(Symbol.for('PasswordHasher'))
    private passwordHasher: IPasswordHasher,

    @inject(Symbol.for('UnitOfWork'))
    private unitOfWork: IUnitOfWork,
  ) {}

  public async execute(
    input: CreateUserDto,
  ): Promise<Result<CreateUserOutput>> {
    try {
      return await this.unitOfWork.runInTransaction(async (transactionId) => {
        const id = new Id(this.idGenerator.generate());
        const email = new Email(input.email);
        const username = new Username(input.username);

        const existingUserByEmail = await this.userRepository.findByEmail(
          email,
          transactionId,
        );
        if (existingUserByEmail) {
          return Result.fail(new UserAlreadyExistsError(email.toString()));
        }

        const hash = await this.passwordHasher.hash(input.password);
        const hashedPassword = new HashedPassword(hash);

        const user = User.create({
          id,
          email,
          username,
          hashedPassword,
        });

        await this.userRepository.save(user, transactionId);

        return Result.ok<CreateUserOutput>({ userId: id.toString() });
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
