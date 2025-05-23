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
import { InsufficientFundsError } from '../../../account/domain/errors/InsufficientFundsError';
import { TransferFundsDto } from '../dtos/TransferFundsDto';

import { TransferFundsUseCase } from './TransferFundsUseCase';

describe('TransferFundsUseCase', () => {
  let useCase: TransferFundsUseCase;
  let accountRepository: MockAccountRepository;
  let transactionRepository: MockTransactionRepository;
  let idGenerator: MockIdGenerator;
  let unitOfWork: MockUnitOfWork;

  beforeEach(() => {
    accountRepository = new MockAccountRepository();
    transactionRepository = new MockTransactionRepository();
    idGenerator = new MockIdGenerator();
    unitOfWork = new MockUnitOfWork();

    useCase = new TransferFundsUseCase(
      accountRepository,
      transactionRepository,
      idGenerator,
      unitOfWork,
    );
  });

  it('should transfer funds between accounts successfully', async () => {
    // Arrange
    const sourceAccountId = 'source-account-id';
    const targetAccountId = 'target-account-id';
    const ownerId = 'test-owner-id';

    await accountRepository.addExistingAccount({
      id: sourceAccountId,
      accountNumber: '123456',
      balance: 1000,
      type: 'CHECKING',
      ownerId: ownerId,
    });

    await accountRepository.addExistingAccount({
      id: targetAccountId,
      accountNumber: '789012',
      balance: 500,
      type: 'SAVINGS',
      ownerId: 'another-owner-id', // Different owner for target account
    });

    const input: TransferFundsDto = {
      sourceAccountId: sourceAccountId,
      targetAccountId: targetAccountId,
      amount: 300,
      description: 'Test transfer',
      requestingUserId: ownerId,
    };

    // Act
    const result = await useCase.execute(input);

    // Assert
    expect(result.isSuccess).toBe(true);
    expect(unitOfWork.transactionExecuted).toBe(true);

    // Verify source account balance was updated
    const sourceAccount = await accountRepository.findById(
      new Id(sourceAccountId),
    );
    expect(sourceAccount).not.toBeNull();
    expect(sourceAccount?.balance.getValue()).toBe(700); // 1000 - 300

    // Verify target account balance was updated
    const targetAccount = await accountRepository.findById(
      new Id(targetAccountId),
    );
    expect(targetAccount).not.toBeNull();
    expect(targetAccount?.balance.getValue()).toBe(800); // 500 + 300

    // Verify transaction was created
    expect(transactionRepository.transactions.length).toBe(1);
    const transaction = transactionRepository.transactions[0];
    expect(transaction.fromId?.toString()).toBe(sourceAccountId);
    expect(transaction.toId?.toString()).toBe(targetAccountId);
    expect(transaction.value.getValue()).toBe(300);
    expect(transaction.description?.toString()).toBe('Test transfer');
    expect(transaction.isTransfer()).toBe(true);
  });

  it('should fail if source account does not exist', async () => {
    // Arrange
    const targetAccountId = 'target-account-id';
    const ownerId = 'test-owner-id';

    await accountRepository.addExistingAccount({
      id: targetAccountId,
      accountNumber: '789012',
      balance: 500,
      type: 'SAVINGS',
      ownerId: 'another-owner-id',
    });

    const input: TransferFundsDto = {
      sourceAccountId: 'non-existent-account',
      targetAccountId: targetAccountId,
      amount: 300,
      requestingUserId: ownerId,
    };

    // Act
    const result = await useCase.execute(input);

    // Assert
    expect(result.isSuccess).toBe(false);
    expect(result.getError()).toBeInstanceOf(NotFoundError);
    expect(transactionRepository.transactions.length).toBe(0);
  });

  it('should fail if target account does not exist', async () => {
    // Arrange
    const sourceAccountId = 'source-account-id';
    const ownerId = 'test-owner-id';

    await accountRepository.addExistingAccount({
      id: sourceAccountId,
      accountNumber: '123456',
      balance: 1000,
      type: 'CHECKING',
      ownerId: ownerId,
    });

    const input: TransferFundsDto = {
      sourceAccountId: sourceAccountId,
      targetAccountId: 'non-existent-account',
      amount: 300,
      requestingUserId: ownerId,
    };

    // Act
    const result = await useCase.execute(input);

    // Assert
    expect(result.isSuccess).toBe(false);
    expect(result.getError()).toBeInstanceOf(NotFoundError);
    expect(transactionRepository.transactions.length).toBe(0);
  });

  it('should fail if requesting user is not the owner of the source account', async () => {
    // Arrange
    const sourceAccountId = 'source-account-id';
    const targetAccountId = 'target-account-id';
    const ownerId = 'test-owner-id';

    await accountRepository.addExistingAccount({
      id: sourceAccountId,
      accountNumber: '123456',
      balance: 1000,
      type: 'CHECKING',
      ownerId: ownerId,
    });

    await accountRepository.addExistingAccount({
      id: targetAccountId,
      accountNumber: '789012',
      balance: 500,
      type: 'SAVINGS',
      ownerId: 'another-owner-id',
    });

    const input: TransferFundsDto = {
      sourceAccountId: sourceAccountId,
      targetAccountId: targetAccountId,
      amount: 300,
      requestingUserId: 'different-user-id', // Different user
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
    const sourceAccountId = 'source-account-id';
    const targetAccountId = 'target-account-id';
    const ownerId = 'test-owner-id';

    await accountRepository.addExistingAccount({
      id: sourceAccountId,
      accountNumber: '123456',
      balance: 1000,
      type: 'CHECKING',
      ownerId: ownerId,
    });

    await accountRepository.addExistingAccount({
      id: targetAccountId,
      accountNumber: '789012',
      balance: 500,
      type: 'SAVINGS',
      ownerId: 'another-owner-id',
    });

    const input: TransferFundsDto = {
      sourceAccountId: sourceAccountId,
      targetAccountId: targetAccountId,
      amount: 0, // Zero amount
      requestingUserId: ownerId,
    };

    // Act
    const result = await useCase.execute(input);

    // Assert
    expect(result.isSuccess).toBe(false);
    expect(result.getError()).toBeInstanceOf(BusinessRuleViolationError);
    expect(transactionRepository.transactions.length).toBe(0);
  });

  it('should fail if source and target accounts are the same', async () => {
    // Arrange
    const accountId = 'test-account-id';
    const ownerId = 'test-owner-id';

    await accountRepository.addExistingAccount({
      id: accountId,
      accountNumber: '123456',
      balance: 1000,
      type: 'CHECKING',
      ownerId: ownerId,
    });

    const input: TransferFundsDto = {
      sourceAccountId: accountId,
      targetAccountId: accountId, // Same account
      amount: 300,
      requestingUserId: ownerId,
    };

    // Act
    const result = await useCase.execute(input);

    // Assert
    expect(result.isSuccess).toBe(false);
    expect(result.getError()).toBeInstanceOf(BusinessRuleViolationError);
    expect(transactionRepository.transactions.length).toBe(0);
  });

  it('should fail if source account has insufficient funds', async () => {
    // Arrange
    const sourceAccountId = 'source-account-id';
    const targetAccountId = 'target-account-id';
    const ownerId = 'test-owner-id';

    await accountRepository.addExistingAccount({
      id: sourceAccountId,
      accountNumber: '123456',
      balance: 100, // Less than transfer amount
      type: 'CHECKING',
      ownerId: ownerId,
    });

    await accountRepository.addExistingAccount({
      id: targetAccountId,
      accountNumber: '789012',
      balance: 500,
      type: 'SAVINGS',
      ownerId: 'another-owner-id',
    });

    const input: TransferFundsDto = {
      sourceAccountId: sourceAccountId,
      targetAccountId: targetAccountId,
      amount: 300, // Exceeds available balance
      requestingUserId: ownerId,
    };

    // Act
    const result = await useCase.execute(input);

    // Assert
    expect(result.isSuccess).toBe(false);
    expect(result.getError()).toBeInstanceOf(InsufficientFundsError);
    expect(transactionRepository.transactions.length).toBe(0);
  });
});
