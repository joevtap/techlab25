import { BusinessRuleViolationError } from '../../../../core/domain/errors';
import {
  MockAccountRepository,
  MockIdGenerator,
  MockUnitOfWork,
  MockUserRepository,
} from '../../../../core/mocks';
import { CreateAccountDto } from '../dtos/CreateAccountDto';

import { CreateAccountUseCase } from './CreateAccountUseCase';

describe('CreateAccountUseCase', () => {
  let useCase: CreateAccountUseCase;
  let accountRepository: MockAccountRepository;
  let userRepository: MockUserRepository;
  let idGenerator: MockIdGenerator;
  let unitOfWork: MockUnitOfWork;

  beforeEach(() => {
    accountRepository = new MockAccountRepository();
    userRepository = new MockUserRepository();
    idGenerator = new MockIdGenerator();
    unitOfWork = new MockUnitOfWork();

    useCase = new CreateAccountUseCase(
      accountRepository,
      userRepository,
      idGenerator,
      unitOfWork,
    );
  });

  it('should create an account successfully', async () => {
    const input: CreateAccountDto = {
      accountNumber: '123456789',
      type: 'CHECKING',
      balance: 1000,
      ownerId: 'existing-user-id',
      requestingUserId: 'existing-user-id',
    };

    await userRepository.addExistingUser({
      id: 'existing-user-id',
      username: 'testuser',
      email: 'test@example.com',
    });

    const result = await useCase.execute(input);

    expect(result.isSuccess).toBe(true);
    expect(result.getValue().id).toBe('test-id-1');
    expect(result.getValue().accountNumber).toBe('123456789');
    expect(result.getValue().type).toBe('CHECKING');
    expect(result.getValue().balance).toBe(1000);

    expect(unitOfWork.transactionExecuted).toBe(true);

    const savedAccount = accountRepository.accounts[0];
    expect(savedAccount).toBeDefined();
    expect(savedAccount.accountNumber.toString()).toBe('123456789');
    expect(savedAccount.type.toString()).toBe('CHECKING');
    expect(savedAccount.balance.getValue()).toBe(1000);
    expect(savedAccount.ownerId.toString()).toBe('existing-user-id');
  });

  it('should fail if account owner does not exist', async () => {
    const input: CreateAccountDto = {
      accountNumber: '123456789',
      type: 'CHECKING',
      balance: 1000,
      ownerId: 'non-existing-user-id',
      requestingUserId: 'non-existing-user-id',
    };

    const result = await useCase.execute(input);

    expect(result.isSuccess).toBe(false);
    expect(result.getError().message).toContain('Account owner does not exist');
    expect(unitOfWork.transactionExecuted).toBe(true);
    expect(accountRepository.accounts.length).toBe(0);
  });

  it('should fail if account with the same number already exists', async () => {
    const input: CreateAccountDto = {
      accountNumber: '123456789',
      type: 'CHECKING',
      balance: 1000,
      ownerId: 'existing-user-id',
      requestingUserId: 'existing-user-id',
    };

    await userRepository.addExistingUser({
      id: 'existing-user-id',
      username: 'testuser',
      email: 'test@example.com',
    });

    await accountRepository.addExistingAccount({
      id: 'existing-account-id',
      accountNumber: '123456789',
      type: 'CHECKING',
      balance: 500,
      ownerId: 'existing-user-id',
    });

    const result = await useCase.execute(input);

    expect(result.isSuccess).toBe(false);
    expect(result.getError().message).toContain(
      'Account with this account number already exists',
    );
    expect(unitOfWork.transactionExecuted).toBe(true);
    expect(accountRepository.accounts.length).toBe(1);
  });

  it('should fail if user tries to create an account for another user', async () => {
    const input: CreateAccountDto = {
      accountNumber: '123456789',
      type: 'CHECKING',
      balance: 1000,
      ownerId: 'existing-user-id',
      requestingUserId: 'another-user-id',
    };

    const result = await useCase.execute(input);
    expect(result.isSuccess).toBe(false);
    expect(result.getError()).toBeInstanceOf(BusinessRuleViolationError);
    expect(unitOfWork.transactionExecuted).toBe(false); // Ownership is checked before transaction
  });
});
