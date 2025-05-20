import { ValidationError } from '../../../../../core/domain/errors';
import { Email } from '../../../../../core/domain/value-objects';
import { Id, Username } from '../../../../../core/domain/value-objects';
import {
  MockPasswordHasher,
  MockTokenService,
  MockUserRepository,
} from '../../../../../core/mocks';
import { User } from '../../../domain/entities/User';
import { InvalidCredentialsError } from '../../../domain/errors';
import { HashedPassword } from '../../../domain/value-objects';
import { UserSignInDto } from '../../dtos/UserSignInDto';

import { SignUserInUseCase } from './SignUserInUseCase';

describe('SignUserInUseCase', () => {
  let useCase: SignUserInUseCase;
  let userRepository: MockUserRepository;
  let passwordHasher: MockPasswordHasher;
  let tokenService: MockTokenService;

  const validEmail = 'test@example.com';
  const validPassword = 'Password123';
  const hashedPassword = 'hashed_Password123';
  const mockToken = 'jwt.token.here';
  const userId = 'user-id-123';
  const username = 'testuser';

  beforeEach(() => {
    userRepository = new MockUserRepository();
    passwordHasher = new MockPasswordHasher();
    tokenService = new MockTokenService();

    tokenService.setMockToken(mockToken);

    passwordHasher.setVerifyResult(true);

    useCase = new SignUserInUseCase(
      userRepository,
      passwordHasher,
      tokenService,
    );
  });

  test('should return token when credentials are valid', async () => {
    const user = User.create({
      id: new Id(userId),
      email: new Email(validEmail),
      username: new Username(username),
      hashedPassword: new HashedPassword(hashedPassword),
    });

    userRepository.users.push(user);

    passwordHasher.setVerifyResult(true);

    const input: UserSignInDto = { email: validEmail, password: validPassword };

    const result = await useCase.execute(input);

    expect(result.isSuccess).toBe(true);
    expect(result.getValue()).toBe(mockToken);
  });

  test('should return InvalidCredentialsError when user is not found', async () => {
    const input: UserSignInDto = { email: validEmail, password: validPassword };

    const result = await useCase.execute(input);

    expect(result.isFailure).toBe(true);
    expect(result.getError()).toBeInstanceOf(InvalidCredentialsError);
    expect(result.getError().message).toBe('Invalid email or password');
  });

  test('should return InvalidCredentialsError when password is invalid', async () => {
    const user = User.create({
      id: new Id(userId),
      email: new Email(validEmail),
      username: new Username(username),
      hashedPassword: new HashedPassword(hashedPassword),
    });

    userRepository.users.push(user);

    passwordHasher.setVerifyResult(false);

    const input: UserSignInDto = {
      email: validEmail,
      password: 'wrongpassword',
    };

    const result = await useCase.execute(input);

    expect(result.isFailure).toBe(true);
    expect(result.getError()).toBeInstanceOf(InvalidCredentialsError);
    expect(result.getError().message).toBe('Invalid email or password');
  });

  test('should return ValidationError for invalid email format', async () => {
    const input: UserSignInDto = {
      email: 'invalid-email',
      password: validPassword,
    };

    const result = await useCase.execute(input);

    expect(result.isFailure).toBe(true);
    expect(result.getError()).toBeInstanceOf(ValidationError);
  });
});
