import { inject, injectable } from 'inversify';

import { Result } from '../../../../../core/application/Result';
import {
  ValidationError,
  BusinessRuleViolationError,
} from '../../../../../core/domain/errors';
import { Email } from '../../../../../core/domain/value-objects';
import { InvalidCredentialsError } from '../../../domain/errors';
import { AuthenticationError } from '../../../domain/errors/AuthenticationError';
import { IUserRepository } from '../../../domain/repositories/IUserRepository';
import { IPasswordHasher } from '../../../domain/services/IPasswordHasher';
import { ITokenService } from '../../../domain/services/ITokenService';
import { UserSignInDto } from '../../dtos/UserSignInDto';

@injectable()
export class SignUserInUseCase {
  constructor(
    @inject(Symbol.for('UserRepository'))
    private readonly userRepository: IUserRepository,

    @inject(Symbol.for('PasswordHasher'))
    private readonly passwordHasher: IPasswordHasher,

    @inject(Symbol.for('TokenService'))
    private readonly tokenService: ITokenService,
  ) {}

  public async execute(input: UserSignInDto): Promise<Result<string>> {
    try {
      const email = new Email(input.email);
      const user = await this.userRepository.findByEmail(email);

      if (!user) {
        return Result.fail(new InvalidCredentialsError());
      }

      const passwordValid = await this.passwordHasher.verify(
        input.password,
        user.hashedPassword.toString(),
      );

      if (!passwordValid) {
        return Result.fail(new InvalidCredentialsError());
      }

      const token = await this.tokenService.generateToken({
        id: user.id.toString(),
        email: user.email.toString(),
        username: user.username.toString(),
      });

      return Result.ok<string>(token);
    } catch (error) {
      if (error instanceof ValidationError) {
        return Result.fail(error);
      } else if (error instanceof BusinessRuleViolationError) {
        return Result.fail(error);
      }

      return Result.fail(
        new AuthenticationError(
          `Authentication failed: ${error instanceof Error ? error.message : String(error)}`,
        ),
      );
    }
  }
}
