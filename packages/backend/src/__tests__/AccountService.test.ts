import { Account } from '../entities/Account';
import { User } from '../entities/User';
import { BusinessRuleViolationError } from '../errors/BusinessRuleViolationError';
import { NotFoundError } from '../errors/NotFoundError';
import { AccountService } from '../services/AccountService';

import { AccountRepositoryMock } from './mocks/AccountRepositoryMock';
import { IdGeneratorMock } from './mocks/IdGeneratorMock';
import { TransactionRepositoryMock } from './mocks/TransactionRepositoryMock';
import { UnitOfWorkMock } from './mocks/UnitOfWorkMock';
import { UserRepositoryMock } from './mocks/UserRepositoryMock';

describe('AccountService', () => {
  let accountService: AccountService;
  let idGenerator: IdGeneratorMock;
  let accountRepository: AccountRepositoryMock;
  let userRepository: UserRepositoryMock;
  let transactionRepository: TransactionRepositoryMock;
  let unitOfWork: UnitOfWorkMock;

  const userId = 'user-123';
  const accountId = 'acc-123';
  const accountNumber = '1234567890';

  beforeEach(() => {
    accountRepository = new AccountRepositoryMock();
    userRepository = new UserRepositoryMock();
    transactionRepository = new TransactionRepositoryMock();

    unitOfWork = new UnitOfWorkMock(
      userRepository,
      accountRepository,
      transactionRepository,
    );

    idGenerator = new IdGeneratorMock();
    idGenerator.setCustomIds([accountId, accountNumber]);

    accountService = new AccountService(unitOfWork, idGenerator);

    userRepository.addUserData(
      new User(userId, 'user@example.com', 'testuser', 'hashedpassword'),
    );
  });

  afterEach(() => {
    jest.resetAllMocks();
  });

  describe('createAccount', () => {
    it('should create a new account successfully', async () => {
      const request = {
        requestingUserId: userId,
        ownerId: userId,
        type: 'CHECKING' as const,
        name: 'Test Account',
        balance: 1000,
      };

      const result = await accountService.createAccount(request);

      expect(result).toBeDefined();
      expect(result.id).toBe(accountId);
      expect(result.name).toBe('Test Account');
      expect(result.type).toBe('CHECKING');
      expect(result.number).toBe(accountNumber);
      expect(result.balance).toBe(1000);
      expect(result.ownerId).toBe(userId);

      // Verify account was added to repository
      const account = await accountRepository.findById(accountId);
      expect(account).toBeDefined();
      expect(account?.name).toBe('Test Account');
    });

    it('should throw error when initial balance is too small', async () => {
      const request = {
        requestingUserId: userId,
        ownerId: userId,
        type: 'CHECKING' as const,
        name: 'Test Account',
        balance: 50, // Below minimum balance of 1_00
      };

      await expect(accountService.createAccount(request)).rejects.toThrow(
        BusinessRuleViolationError,
      );
      await expect(accountService.createAccount(request)).rejects.toThrow(
        'too small',
      );
    });

    it('should throw error when initial balance is too large', async () => {
      const request = {
        requestingUserId: userId,
        ownerId: userId,
        type: 'CHECKING' as const,
        name: 'Test Account',
        balance: 2000000, // Above maximum balance of 10_000_00
      };

      await expect(accountService.createAccount(request)).rejects.toThrow(
        BusinessRuleViolationError,
      );
      await expect(accountService.createAccount(request)).rejects.toThrow(
        'too big',
      );
    });

    it('should throw error when requesting user is not owner', async () => {
      const request = {
        requestingUserId: 'different-user-id',
        ownerId: userId,
        type: 'CHECKING' as const,
        name: 'Test Account',
        balance: 1000,
      };

      await expect(accountService.createAccount(request)).rejects.toThrow(
        BusinessRuleViolationError,
      );
      await expect(accountService.createAccount(request)).rejects.toThrow(
        'cannot perform operations for another user',
      );
    });

    it('should throw error when owner does not exist', async () => {
      userRepository.reset(); // Remove all users

      const request = {
        requestingUserId: userId,
        ownerId: userId,
        type: 'CHECKING' as const,
        name: 'Test Account',
        balance: 1000,
      };

      await expect(accountService.createAccount(request)).rejects.toThrow(
        BusinessRuleViolationError,
      );
      await expect(accountService.createAccount(request)).rejects.toThrow(
        'Account owner does not exist',
      );
    });
  });

  describe('listUserAccounts', () => {
    beforeEach(() => {
      accountRepository.addAccountData(
        new Account(
          'acc-1',
          'CHECKING',
          'Checking 1',
          '1111111111',
          1000,
          userId,
        ),
      );
      accountRepository.addAccountData(
        new Account(
          'acc-2',
          'SAVINGS',
          'Savings 1',
          '2222222222',
          2000,
          userId,
        ),
      );
      accountRepository.addAccountData(
        new Account(
          'acc-3',
          'CHECKING',
          'Other User Account',
          '3333333333',
          3000,
          'other-user',
        ),
      );
    });

    it('should return only accounts owned by the specified user', async () => {
      const request = {
        requestingUserId: userId,
        ownerId: userId,
      };

      const result = await accountService.listUserAccounts(request);

      expect(result).toBeDefined();
      expect(result.accounts).toHaveLength(2);
      expect(result.accounts.map((a) => a.id)).toEqual(['acc-1', 'acc-2']);
      expect(result.accounts.map((a) => a.name)).toEqual([
        'Checking 1',
        'Savings 1',
      ]);
    });

    it('should throw error when requesting user is not owner', async () => {
      const request = {
        requestingUserId: 'different-user-id',
        ownerId: userId,
      };

      await expect(accountService.listUserAccounts(request)).rejects.toThrow(
        BusinessRuleViolationError,
      );
    });
  });

  describe('updateAccount', () => {
    beforeEach(() => {
      accountRepository.addAccountData(
        new Account(
          accountId,
          'CHECKING',
          'Original Name',
          accountNumber,
          1000,
          userId,
        ),
      );
    });

    it('should update account name and type', async () => {
      const request = {
        requestingUserId: userId,
        id: accountId,
        name: 'Updated Name',
        type: 'SAVINGS' as const,
      };

      const result = await accountService.updateAccount(request);

      expect(result).toBeDefined();
      expect(result.id).toBe(accountId);
      expect(result.name).toBe('Updated Name');
      expect(result.type).toBe('SAVINGS');
      expect(result.number).toBe(accountNumber);
      expect(result.balance).toBe(1000); // Balance should remain unchanged
    });

    it('should throw error when account does not exist', async () => {
      const request = {
        requestingUserId: userId,
        id: 'non-existent-id',
        name: 'Updated Name',
        type: 'SAVINGS' as const,
      };

      await expect(accountService.updateAccount(request)).rejects.toThrow(
        NotFoundError,
      );
    });

    it('should throw error when requesting user is not owner', async () => {
      const request = {
        requestingUserId: 'different-user-id',
        id: accountId,
        name: 'Updated Name',
        type: 'SAVINGS' as const,
      };

      await expect(accountService.updateAccount(request)).rejects.toThrow(
        BusinessRuleViolationError,
      );
      await expect(accountService.updateAccount(request)).rejects.toThrow(
        'does not own the account',
      );
    });
  });

  describe('deleteAccount', () => {
    beforeEach(() => {
      accountRepository.addAccountData(
        new Account(
          accountId,
          'CHECKING',
          'Test Account',
          accountNumber,
          1000,
          userId,
        ),
      );
    });

    it('should delete an account successfully', async () => {
      const request = {
        requestingUserId: userId,
        accountId: accountId,
      };

      const result = await accountService.deleteAccount(request);

      expect(result).toBeDefined();
      expect(result.id).toBe(accountId);

      const account = await accountRepository.findById(accountId);
      expect(account).toBeNull();
    });

    it('should throw error when account does not exist', async () => {
      const request = {
        requestingUserId: userId,
        accountId: 'non-existent-id',
      };

      await expect(accountService.deleteAccount(request)).rejects.toThrow(
        NotFoundError,
      );
    });

    it('should throw error when requesting user is not owner', async () => {
      const request = {
        requestingUserId: 'different-user-id',
        accountId: accountId,
      };

      await expect(accountService.deleteAccount(request)).rejects.toThrow(
        BusinessRuleViolationError,
      );
    });
  });
});
