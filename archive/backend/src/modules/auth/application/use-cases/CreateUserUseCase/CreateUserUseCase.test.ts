import {
  MockIdGenerator,
  MockPasswordHasher,
  MockUnitOfWork,
  MockUserRepository,
} from '../../../../../core/mocks';
import { UserAlreadyExistsError } from '../../../domain/errors/UserAlreadyExistsError';
import { CreateUserDto } from '../../dtos/CreateUserDto';

import { CreateUserUseCase } from './CreateUserUseCase';

describe('CreateUserUseCase', () => {
  let useCase: CreateUserUseCase;
  let userRepository: MockUserRepository;
  let idGenerator: MockIdGenerator;
  let passwordHasher: MockPasswordHasher;
  let unitOfWork: MockUnitOfWork;

  beforeEach(() => {
    userRepository = new MockUserRepository();
    idGenerator = new MockIdGenerator();
    passwordHasher = new MockPasswordHasher();
    unitOfWork = new MockUnitOfWork();

    useCase = new CreateUserUseCase(
      userRepository,
      idGenerator,
      passwordHasher,
      unitOfWork,
    );
  });

  it('should create a user successfully', async () => {
    const input: CreateUserDto = {
      username: 'testuser',
      email: 'test@example.com',
      password: 'Password123!',
    };

    const result = await useCase.execute(input);

    expect(result.isSuccess).toBe(true);
    expect(result.getValue().userId).toBe('test-id-1');
    expect(unitOfWork.transactionExecuted).toBe(true);

    const savedUser = userRepository.users[0];
    expect(savedUser).toBeDefined();
    expect(savedUser.email.toString()).toBe('test@example.com');
    expect(savedUser.username.toString()).toBe('testuser');
    expect(savedUser.hashedPassword.toString()).toBe('hashed_Password123!');
  });

  it('should fail if user with email already exists', async () => {
    const existingUser = {
      email: 'test@example.com',
    };

    await userRepository.addExistingUser(existingUser);

    const input: CreateUserDto = {
      username: 'testuser',
      email: 'test@example.com',
      password: 'Password123!',
    };

    const result = await useCase.execute(input);

    expect(result.isSuccess).toBe(false);
    expect(result.getError()).toBeInstanceOf(UserAlreadyExistsError);
    expect(unitOfWork.transactionExecuted).toBe(true);
  });
});
