import { User } from '../entities/User';
import { InvalidCredentialsError } from '../errors/InvalidCredentialsError';
import { UserAlreadyExistsError } from '../errors/UserAlreadyExistsError';
import { UserService } from '../services/UserService';

import { AccountRepositoryMock } from './mocks/AccountRepositoryMock';
import { IdGeneratorMock } from './mocks/IdGeneratorMock';
import { PasswordHasherMock } from './mocks/PasswordHasherMock';
import { TokenServiceMock } from './mocks/TokenServiceMock';
import { TransactionRepositoryMock } from './mocks/TransactionRepositoryMock';
import { UnitOfWorkMock } from './mocks/UnitOfWorkMock';
import { UserRepositoryMock } from './mocks/UserRepositoryMock';

describe('UserService', () => {
  let userService: UserService;
  let idGenerator: IdGeneratorMock;
  let passwordHasher: PasswordHasherMock;
  let tokenService: TokenServiceMock;
  let userRepository: UserRepositoryMock;
  let accountRepository: AccountRepositoryMock;
  let transactionRepository: TransactionRepositoryMock;
  let unitOfWork: UnitOfWorkMock;

  const userId = 'user-123';
  const email = 'user@example.com';
  const username = 'testuser';
  const password = 'password123';
  const hashedPassword = 'hashed_password123';

  beforeEach(() => {
    userRepository = new UserRepositoryMock();
    accountRepository = new AccountRepositoryMock();
    transactionRepository = new TransactionRepositoryMock();

    unitOfWork = new UnitOfWorkMock(
      userRepository,
      accountRepository,
      transactionRepository,
    );

    idGenerator = new IdGeneratorMock();
    idGenerator.setCustomIds([userId]);

    passwordHasher = new PasswordHasherMock();

    tokenService = new TokenServiceMock();

    userService = new UserService(
      unitOfWork,
      idGenerator,
      tokenService,
      passwordHasher,
    );
  });

  afterEach(() => {
    jest.resetAllMocks();
  });

  describe('createUser', () => {
    it('should create a new user successfully', async () => {
      const request = {
        email,
        username,
        password,
      };

      const result = await userService.createUser(request);

      expect(result).toBeDefined();
      expect(result.id).toBe(userId);
      expect(result.email).toBe(email);
      expect(result.username).toBe(username);

      // Verify user was added to repository with hashed password
      const user = await userRepository.findById(userId);
      expect(user).toBeDefined();
      expect(user?.email).toBe(email);
      expect(user?.username).toBe(username);
      expect(user?.password).toBe(hashedPassword);
    });

    it('should throw error when email is already in use', async () => {
      // Add existing user with same email
      userRepository.addUserData(
        new User(
          'existing-id',
          email,
          'existinguser',
          'existing_hashed_password',
        ),
      );

      const request = {
        email,
        username,
        password,
      };

      await expect(userService.createUser(request)).rejects.toThrow(
        UserAlreadyExistsError,
      );
    });
  });

  describe('signUserIn', () => {
    beforeEach(() => {
      userRepository.addUserData(
        new User(userId, email, username, hashedPassword),
      );
    });

    it('should sign in user successfully and return token', async () => {
      const request = {
        email,
        password,
      };

      const result = await userService.signUserIn(request);

      expect(result).toBeDefined();
      expect(result.token).toBe('test-token');
    });

    it('should throw error when email is not found', async () => {
      const request = {
        email: 'nonexistent@example.com',
        password,
      };

      await expect(userService.signUserIn(request)).rejects.toThrow(
        InvalidCredentialsError,
      );
    });

    it('should throw error when password is incorrect', async () => {
      const request = {
        email,
        password: 'wrong-password',
      };

      await expect(userService.signUserIn(request)).rejects.toThrow(
        InvalidCredentialsError,
      );
    });

    it('should generate token with correct payload', async () => {
      const request = {
        email,
        password,
      };

      const spyGenerateToken = jest.spyOn(tokenService, 'generateToken');

      await userService.signUserIn(request);

      expect(spyGenerateToken).toHaveBeenCalledWith({
        id: userId,
        email,
        username,
      });
    });
  });
});
