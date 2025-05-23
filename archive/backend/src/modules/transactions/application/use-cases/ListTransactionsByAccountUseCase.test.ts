import {
  BusinessRuleViolationError,
  NotFoundError,
} from '../../../../core/domain/errors';
import { Id } from '../../../../core/domain/value-objects';
import {
  MockAccountRepository,
  MockTransactionRepository,
} from '../../../../core/mocks';
import { Transaction } from '../../domain/entities/Transaction';
import { Description } from '../../domain/value-objects/Description';
import { TransactionDate } from '../../domain/value-objects/TransactionDate';
import { TransactionValue } from '../../domain/value-objects/TransactionValue';
import { ListTransactionsByAccountDto } from '../dtos/ListTransactionsByAccountDto';

import { ListTransactionsByAccountUseCase } from './ListTransactionsByAccountUseCase';

describe('ListTransactionsByAccountUseCase', () => {
  let useCase: ListTransactionsByAccountUseCase;
  let accountRepository: MockAccountRepository;
  let transactionRepository: MockTransactionRepository;

  beforeEach(() => {
    accountRepository = new MockAccountRepository();
    transactionRepository = new MockTransactionRepository();

    useCase = new ListTransactionsByAccountUseCase(
      accountRepository,
      transactionRepository,
    );
  });

  it('should list all transactions for an account', async () => {
    // Arrange
    const accountId = 'test-account-id';
    const ownerId = 'test-owner-id';
    const otherAccountId = 'other-account-id';

    // Create test account
    await accountRepository.addExistingAccount({
      id: accountId,
      accountNumber: '123456',
      type: 'CHECKING',
      balance: 1000,
      ownerId: ownerId,
    });

    // Create some test transactions for the account
    const date = new Date();

    // A credit transaction to the account
    const transaction1 = Transaction.credit({
      id: new Id('transaction-1'),
      toId: new Id(accountId),
      value: new TransactionValue(500),
      description: new Description('Deposit'),
      createdAt: new TransactionDate(
        new Date(date.getTime() - 3 * 24 * 60 * 60 * 1000),
      ), // 3 days ago
    });

    // A debit transaction from the account
    const transaction2 = Transaction.debit({
      id: new Id('transaction-2'),
      fromId: new Id(accountId),
      value: new TransactionValue(200),
      description: new Description('Withdrawal'),
      createdAt: new TransactionDate(
        new Date(date.getTime() - 2 * 24 * 60 * 60 * 1000),
      ), // 2 days ago
    });

    // A transfer transaction from the account
    const transaction3 = Transaction.transfer({
      id: new Id('transaction-3'),
      fromId: new Id(accountId),
      toId: new Id(otherAccountId),
      value: new TransactionValue(300),
      description: new Description('Transfer out'),
      createdAt: new TransactionDate(
        new Date(date.getTime() - 24 * 60 * 60 * 1000),
      ), // 1 day ago
    });

    // A transfer transaction to the account
    const transaction4 = Transaction.transfer({
      id: new Id('transaction-4'),
      fromId: new Id(otherAccountId),
      toId: new Id(accountId),
      value: new TransactionValue(100),
      description: new Description('Transfer in'),
      createdAt: new TransactionDate(date), // Today
    });

    // A transaction not related to the account (should not be returned)
    const transaction5 = Transaction.transfer({
      id: new Id('transaction-5'),
      fromId: new Id('unrelated-account-1'),
      toId: new Id('unrelated-account-2'),
      value: new TransactionValue(50),
      description: new Description('Unrelated'),
      createdAt: new TransactionDate(date),
    });

    await transactionRepository.save(transaction1);
    await transactionRepository.save(transaction2);
    await transactionRepository.save(transaction3);
    await transactionRepository.save(transaction4);
    await transactionRepository.save(transaction5);

    const input: ListTransactionsByAccountDto = {
      accountId: accountId,
      requestingUserId: ownerId,
    };

    // Act
    const result = await useCase.execute(input);

    // Assert
    expect(result.isSuccess).toBe(true);

    const data = result.getValue();
    expect(data.transactions).toHaveLength(4); // Should include all 4 transactions related to the account
    expect(data.transactions.map((t) => t.id)).toContain('transaction-1');
    expect(data.transactions.map((t) => t.id)).toContain('transaction-2');
    expect(data.transactions.map((t) => t.id)).toContain('transaction-3');
    expect(data.transactions.map((t) => t.id)).toContain('transaction-4');
    expect(data.transactions.map((t) => t.id)).not.toContain('transaction-5'); // Should not include unrelated transaction
  });

  it('should list transactions for an account filtered by date range', async () => {
    // Arrange
    const accountId = 'test-account-id';
    const ownerId = 'test-owner-id';

    // Create test account
    await accountRepository.addExistingAccount({
      id: accountId,
      accountNumber: '123456',
      type: 'CHECKING',
      balance: 1000,
      ownerId: ownerId,
    });

    // Create transactions with different dates
    const today = new Date();
    const yesterday = new Date(today.getTime() - 24 * 60 * 60 * 1000);
    const twoDaysAgo = new Date(today.getTime() - 2 * 24 * 60 * 60 * 1000);
    const threeDaysAgo = new Date(today.getTime() - 3 * 24 * 60 * 60 * 1000);

    const transaction1 = Transaction.credit({
      id: new Id('transaction-1'),
      toId: new Id(accountId),
      value: new TransactionValue(100),
      createdAt: new TransactionDate(threeDaysAgo),
    });

    const transaction2 = Transaction.credit({
      id: new Id('transaction-2'),
      toId: new Id(accountId),
      value: new TransactionValue(200),
      createdAt: new TransactionDate(twoDaysAgo),
    });

    const transaction3 = Transaction.credit({
      id: new Id('transaction-3'),
      toId: new Id(accountId),
      value: new TransactionValue(300),
      createdAt: new TransactionDate(yesterday),
    });

    const transaction4 = Transaction.credit({
      id: new Id('transaction-4'),
      toId: new Id(accountId),
      value: new TransactionValue(400),
      createdAt: new TransactionDate(today),
    });

    await transactionRepository.save(transaction1);
    await transactionRepository.save(transaction2);
    await transactionRepository.save(transaction3);
    await transactionRepository.save(transaction4);

    const input: ListTransactionsByAccountDto = {
      accountId: accountId,
      requestingUserId: ownerId,
      startDate: twoDaysAgo.toISOString(), // From 2 days ago
      endDate: yesterday.toISOString(), // To yesterday
    };

    // Act
    const result = await useCase.execute(input);

    // Assert
    expect(result.isSuccess).toBe(true);

    const data = result.getValue();
    expect(data.transactions).toHaveLength(2); // Should only include transactions from the date range
    expect(data.transactions.map((t) => t.id)).toContain('transaction-2');
    expect(data.transactions.map((t) => t.id)).toContain('transaction-3');
    expect(data.transactions.map((t) => t.id)).not.toContain('transaction-1'); // Outside date range
    expect(data.transactions.map((t) => t.id)).not.toContain('transaction-4'); // Outside date range
  });

  it('should fail if account does not exist', async () => {
    // Arrange
    const input: ListTransactionsByAccountDto = {
      accountId: 'non-existent-account',
      requestingUserId: 'test-owner-id',
    };

    // Act
    const result = await useCase.execute(input);

    // Assert
    expect(result.isSuccess).toBe(false);
    expect(result.getError()).toBeInstanceOf(NotFoundError);
  });

  it('should fail if requesting user is not the owner of the account', async () => {
    // Arrange
    const accountId = 'test-account-id';
    const ownerId = 'test-owner-id';

    // Create test account
    await accountRepository.addExistingAccount({
      id: accountId,
      accountNumber: '123456',
      type: 'CHECKING',
      balance: 1000,
      ownerId: ownerId,
    });

    const input: ListTransactionsByAccountDto = {
      accountId: accountId,
      requestingUserId: 'different-user-id', // Not the owner
    };

    // Act
    const result = await useCase.execute(input);

    // Assert
    expect(result.isSuccess).toBe(false);
    expect(result.getError()).toBeInstanceOf(BusinessRuleViolationError);
  });
});
