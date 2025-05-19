import { inject, injectable } from 'inversify';
import { User } from '../../../domain/entities/User';
import { HashedPassword } from '../../../domain/value-objects';
import { CreateUserDto } from '@techlab25/contracts/dtos/auth/CreateUserDto';
import { Result } from '../../../../../core/application/Result';
import {
  BusinessRuleViolationError,
  ValidationError,
} from '../../../../../core/domain/errors';
import { IIdGenerator } from '../../../../../core/domain/services/IIdGenerator';
import { Id, Email, Username } from '../../../../../core/domain/value-objects';
import { IUserRepository } from '../../../domain/repositories/IUserRepository';
import { IPasswordHasher } from '../../../domain/services/IPasswordHasher';

type CreateUserOutput = {
  userId: string;
};

@injectable()
export class CreateUserUseCase {
  constructor(
    @inject(Symbol.for('UserRepository'))
    private userRepository: IUserRepository,

    @inject(Symbol.for('IdGenerator'))
    private idGenerator: IIdGenerator,

    @inject(Symbol.for('PasswordHasher'))
    private passwordHasher: IPasswordHasher,
  ) {}

  async execute(input: CreateUserDto): Promise<Result<CreateUserOutput>> {
    try {
      const id = new Id(this.idGenerator.generate());
      const email = new Email(input.email);
      const username = new Username(input.username);

      const existingUserByEmail = await this.userRepository.findByEmail(email);
      if (existingUserByEmail) {
        return Result.fail(
          new BusinessRuleViolationError('User with this email already exists'),
        );
      }

      const hash = await this.passwordHasher.hash(input.password);
      const hashedPassword = new HashedPassword(hash);

      const user = User.create({
        id,
        email,
        username,
        hashedPassword,
      });

      await this.userRepository.save(user);

      return Result.ok<CreateUserOutput>({ userId: id.toString() });
    } catch (error) {
      switch (error) {
        case ValidationError:
          return Result.fail(error as ValidationError);
        case BusinessRuleViolationError:
          return Result.fail(error as BusinessRuleViolationError);
      }

      return Result.fail(
        new Error(
          `Failed to create user: ${error instanceof Error ? error.message : String(error)}`,
        ),
      );
    }
  }
}
