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
import { WithdrawFundsDto } from '../dtos/WithdrawFundsDto';

import { WithdrawFundsUseCase } from './WithdrawFundsUseCase';

describe('WithdrawFundsUseCase', () => {
  let useCase: WithdrawFundsUseCase;
  let accountRepository: MockAccountRepository;
  let transactionRepository: MockTransactionRepository;
  let idGenerator: MockIdGenerator;
  let unitOfWork: MockUnitOfWork;

  beforeEach(() => {
    accountRepository = new MockAccountRepository();
    transactionRepository = new MockTransactionRepository();
    idGenerator = new MockIdGenerator();
    unitOfWork = new MockUnitOfWork();

    useCase = new WithdrawFundsUseCase(
      accountRepository,
      transactionRepository,
      idGenerator,
      unitOfWork,
    );
  });

  it('should withdraw funds from account successfully', async () => {
    // Arrange
    const initialBalance = 1000;
    const accountId = 'test-account-id';
    const ownerId = 'test-owner-id';

    await accountRepository.addExistingAccount({
      id: accountId,
      accountNumber: '123456789',
      balance: initialBalance,
      type: 'CHECKING',
      ownerId: ownerId,
    });

    const input: WithdrawFundsDto = {
      accountId: accountId,
      amount: 500,
      description: 'Test withdrawal',
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
    expect(account?.balance.getValue()).toBe(500);

    // Verify transaction was created
    expect(transactionRepository.transactions.length).toBe(1);
    const transaction = transactionRepository.transactions[0];
    expect(transaction.fromId?.toString()).toBe(accountId);
    expect(transaction.value.getValue()).toBe(500);
    expect(transaction.description?.toString()).toBe('Test withdrawal');
    expect(transaction.isDebit()).toBe(true);
  });

  it('should fail if account does not exist', async () => {
    // Arrange
    const input: WithdrawFundsDto = {
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

    const input: WithdrawFundsDto = {
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

    const input: WithdrawFundsDto = {
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

  it('should fail if insufficient funds', async () => {
    // Arrange
    const initialBalance = 100;
    const accountId = 'test-account-id';
    const ownerId = 'test-owner-id';

    await accountRepository.addExistingAccount({
      id: accountId,
      accountNumber: '123456789',
      balance: initialBalance,
      type: 'CHECKING',
      ownerId: ownerId,
    });

    const input: WithdrawFundsDto = {
      accountId: accountId,
      amount: 500,
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
