import {
  BusinessRuleViolationError,
  NotFoundError,
} from '../../../../core/domain/errors';
import { Id } from '../../../../core/domain/value-objects';
import {
  MockAccountRepository,
  MockIdGenerator,
  MockTransactionRepository,
  MockUnitOfWork,
} from '../../../../core/mocks';
import { AddFundsDto } from '../dtos/AddFundsDto';

import { AddFundsUseCase } from './AddFundsUseCase';

describe('AddFundsUseCase', () => {
  let useCase: AddFundsUseCase;
  let accountRepository: MockAccountRepository;
  let transactionRepository: MockTransactionRepository;
  let idGenerator: MockIdGenerator;
  let unitOfWork: MockUnitOfWork;

  beforeEach(() => {
    accountRepository = new MockAccountRepository();
    transactionRepository = new MockTransactionRepository();
    idGenerator = new MockIdGenerator();
    unitOfWork = new MockUnitOfWork();

    useCase = new AddFundsUseCase(
      accountRepository,
      transactionRepository,
      idGenerator,
      unitOfWork,
    );
  });

  it('should add funds to account successfully', async () => {
    // Arrange
    const initialBalance = 1000;
    const accountId = 'test-account-id';
    const ownerId = 'test-owner-id';

    // Add existing account
    await accountRepository.addExistingAccount({
      id: accountId,
      accountNumber: '123456789',
      balance: initialBalance,
      type: 'CHECKING',
      ownerId: ownerId,
    });

    const input: AddFundsDto = {
      accountId: accountId,
      amount: 500,
      description: 'Test deposit',
      requestingUserId: ownerId,
    };

    // Act
    const result = await useCase.execute(input);

    // Assert
    expect(result.isSuccess).toBe(true);
    expect(unitOfWork.transactionExecuted).toBe(true);

    // Verify account balance was updated
    const account = await accountRepository.findById(new Id(accountId));
    expect(account).not.toBeNull();
    expect(account?.balance.getValue()).toBe(1500);

    // Verify transaction was created
    expect(transactionRepository.transactions.length).toBe(1);
    const transaction = transactionRepository.transactions[0];
    expect(transaction.toId?.toString()).toBe(accountId);
    expect(transaction.value.getValue()).toBe(500);
    expect(transaction.description?.toString()).toBe('Test deposit');
    expect(transaction.isCredit()).toBe(true);
  });

  it('should fail if account does not exist', async () => {
    // Arrange
    const input: AddFundsDto = {
      accountId: 'non-existent-account',
      amount: 500,
      requestingUserId: 'test-owner-id',
    };

    // Act
    const result = await useCase.execute(input);

    // Assert
    expect(result.isSuccess).toBe(false);
    expect(result.getError()).toBeInstanceOf(NotFoundError);
    expect(transactionRepository.transactions.length).toBe(0);
  });

  it('should fail if requesting user is not the owner of the account', async () => {
    // Arrange
    const accountId = 'test-account-id';
    const ownerId = 'test-owner-id';

    await accountRepository.addExistingAccount({
      id: accountId,
      accountNumber: '123456789',
      balance: 1000,
      type: 'CHECKING',
      ownerId: ownerId,
    });

    const input: AddFundsDto = {
      accountId: accountId,
      amount: 500,
      requestingUserId: 'different-user-id',
    };

    // Act
    const result = await useCase.execute(input);

    // Assert
    expect(result.isSuccess).toBe(false);
    expect(result.getError()).toBeInstanceOf(BusinessRuleViolationError);
    expect(transactionRepository.transactions.length).toBe(0);
  });

  it('should fail if amount is not positive', async () => {
    // Arrange
    const accountId = 'test-account-id';
    const ownerId = 'test-owner-id';

    await accountRepository.addExistingAccount({
      id: accountId,
      accountNumber: '123456789',
      balance: 1000,
      type: 'CHECKING',
      ownerId: ownerId,
    });

    const input: AddFundsDto = {
      accountId: accountId,
      amount: 0,
      requestingUserId: ownerId,
    };

    // Act
    const result = await useCase.execute(input);

    // Assert
    expect(result.isSuccess).toBe(false);
    expect(result.getError()).toBeInstanceOf(BusinessRuleViolationError);
    expect(transactionRepository.transactions.length).toBe(0);
  });
});
