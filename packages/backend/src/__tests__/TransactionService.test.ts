import { Account } from '../entities/Account';
import { Transaction } from '../entities/Transaction';
import { BusinessRuleViolationError } from '../errors/BusinessRuleViolationError';
import { InsufficientFundsError } from '../errors/InsufficientFundsError';
import { NotFoundError } from '../errors/NotFoundError';
import { TransactionService } from '../services/TransactionService';

import { AccountRepositoryMock } from './mocks/AccountRepositoryMock';
import { IdGeneratorMock } from './mocks/IdGeneratorMock';
import { TransactionRepositoryMock } from './mocks/TransactionRepositoryMock';
import { UnitOfWorkMock } from './mocks/UnitOfWorkMock';
import { UserRepositoryMock } from './mocks/UserRepositoryMock';

describe('TransactionService', () => {
  let transactionService: TransactionService;
  let idGenerator: IdGeneratorMock;
  let accountRepository: AccountRepositoryMock;
  let userRepository: UserRepositoryMock;
  let transactionRepository: TransactionRepositoryMock;
  let unitOfWork: UnitOfWorkMock;

  const userId = 'user-123';
  const transactionId = 'tx-123';
  const sourceAccountNumber = '1234567890';
  const targetAccountNumber = '0987654321';

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
    idGenerator.setCustomIds([transactionId]);

    transactionService = new TransactionService(unitOfWork, idGenerator);

    accountRepository.addAccountData(
      new Account(
        'acc-1',
        'CHECKING',
        'Source Account',
        sourceAccountNumber,
        5000,
        userId,
      ),
    );
    accountRepository.addAccountData(
      new Account(
        'acc-2',
        'CHECKING',
        'Target Account',
        targetAccountNumber,
        1000,
        userId,
      ),
    );
  });

  describe('transferFunds', () => {
    it('should transfer funds between accounts successfully', async () => {
      const request = {
        requestingUserId: userId,
        sourceAccountNumber,
        targetAccountNumber,
        amount: 1000,
        description: 'Test transfer',
      };

      const result = await transactionService.transferFunds(request);

      expect(result).toBeDefined();
      expect(result.id).toBe(transactionId);
      expect(result.sourceAccountNumber).toBe(sourceAccountNumber);
      expect(result.targetAccountNumber).toBe(targetAccountNumber);
      expect(result.amount).toBe(1000);

      const sourceAccount =
        await accountRepository.findByNumber(sourceAccountNumber);
      const targetAccount =
        await accountRepository.findByNumber(targetAccountNumber);
      expect(sourceAccount?.balance).toBe(4000); // 5000 - 1000
      expect(targetAccount?.balance).toBe(2000); // 1000 + 1000

      const transactions =
        await transactionRepository.findAllByAccountNumber(sourceAccountNumber);
      expect(transactions).toHaveLength(1);
      expect(transactions[0].id).toBe(transactionId);
      expect(transactions[0].type).toBe('TRANSFER');
      expect(transactions[0].amount).toBe(1000);
      expect(transactions[0].source).toBe(sourceAccountNumber);
      expect(transactions[0].target).toBe(targetAccountNumber);
      expect(transactions[0].description).toBe('Test transfer');
    });

    it('should throw error when source account does not exist', async () => {
      const request = {
        requestingUserId: userId,
        sourceAccountNumber: 'non-existent-account',
        targetAccountNumber,
        amount: 1000,
      };

      await expect(transactionService.transferFunds(request)).rejects.toThrow(
        NotFoundError,
      );
    });

    it('should throw error when target account does not exist', async () => {
      const request = {
        requestingUserId: userId,
        sourceAccountNumber,
        targetAccountNumber: 'non-existent-account',
        amount: 1000,
      };

      await expect(transactionService.transferFunds(request)).rejects.toThrow(
        NotFoundError,
      );
    });

    it('should throw error when amount is not positive', async () => {
      const request = {
        requestingUserId: userId,
        sourceAccountNumber,
        targetAccountNumber,
        amount: 0,
      };

      await expect(transactionService.transferFunds(request)).rejects.toThrow(
        BusinessRuleViolationError,
      );
      await expect(transactionService.transferFunds(request)).rejects.toThrow(
        'Amount must be positive',
      );
    });

    it('should throw error when source and target accounts are the same', async () => {
      const request = {
        requestingUserId: userId,
        sourceAccountNumber,
        targetAccountNumber: sourceAccountNumber,
        amount: 1000,
      };

      await expect(transactionService.transferFunds(request)).rejects.toThrow(
        BusinessRuleViolationError,
      );
      await expect(transactionService.transferFunds(request)).rejects.toThrow(
        'Cannot transfer to the same account',
      );
    });

    it('should throw error when requesting user does not own the source account', async () => {
      const sourceAccount =
        await accountRepository.findByNumber(sourceAccountNumber);
      if (sourceAccount) {
        const updatedAccount = new Account(
          sourceAccount.id,
          sourceAccount.type,
          sourceAccount.name,
          sourceAccount.number,
          sourceAccount.balance,
          'different-user-id',
        );
        await accountRepository.update(updatedAccount);
      }

      const request = {
        requestingUserId: userId,
        sourceAccountNumber,
        targetAccountNumber,
        amount: 1000,
      };

      await expect(transactionService.transferFunds(request)).rejects.toThrow(
        BusinessRuleViolationError,
      );
      await expect(transactionService.transferFunds(request)).rejects.toThrow(
        'does not own the account',
      );
    });

    it('should throw error when insufficient funds in source account', async () => {
      const request = {
        requestingUserId: userId,
        sourceAccountNumber,
        targetAccountNumber,
        amount: 100_00, // more than available balance
      };

      await expect(transactionService.transferFunds(request)).rejects.toThrow(
        InsufficientFundsError,
      );
    });
  });

  describe('addFunds', () => {
    it('should add funds to an account successfully', async () => {
      const request = {
        requestingUserId: userId,
        accountNumber: sourceAccountNumber,
        amount: 1000,
        description: 'Add funds test',
      };

      const result = await transactionService.addFunds(request);

      expect(result).toBeDefined();
      expect(result.id).toBe(transactionId);
      expect(result.accountNumber).toBe(sourceAccountNumber);
      expect(result.amount).toBe(1000);
      expect(result.newBalance).toBe(6000); // 5000 + 1000

      const sourceAccount =
        await accountRepository.findByNumber(sourceAccountNumber);
      expect(sourceAccount?.balance).toBe(6000);

      const transactions =
        await transactionRepository.findAllByAccountNumber(sourceAccountNumber);
      expect(transactions).toHaveLength(1);
      expect(transactions[0].id).toBe(transactionId);
      expect(transactions[0].type).toBe('CREDIT');
      expect(transactions[0].amount).toBe(1000);
      expect(transactions[0].target).toBe(sourceAccountNumber);
      expect(transactions[0].source).toBeUndefined();
      expect(transactions[0].description).toBe('Add funds test');
    });

    it('should use default description when none provided', async () => {
      const request = {
        requestingUserId: userId,
        accountNumber: sourceAccountNumber,
        amount: 1000,
      };

      await transactionService.addFunds(request);

      const transactions =
        await transactionRepository.findAllByAccountNumber(sourceAccountNumber);
      expect(transactions[0].description).toBe('Add funds');
    });

    it('should throw error when account does not exist', async () => {
      const request = {
        requestingUserId: userId,
        accountNumber: 'non-existent-account',
        amount: 1000,
      };

      await expect(transactionService.addFunds(request)).rejects.toThrow(
        NotFoundError,
      );
    });

    it('should throw error when amount is not positive', async () => {
      const request = {
        requestingUserId: userId,
        accountNumber: sourceAccountNumber,
        amount: 0,
      };

      await expect(transactionService.addFunds(request)).rejects.toThrow(
        BusinessRuleViolationError,
      );
      await expect(transactionService.addFunds(request)).rejects.toThrow(
        'Amount must be positive',
      );
    });

    it('should throw error when requesting user does not own the account', async () => {
      const request = {
        requestingUserId: 'different-user-id',
        accountNumber: sourceAccountNumber,
        amount: 1000,
      };

      await expect(transactionService.addFunds(request)).rejects.toThrow(
        BusinessRuleViolationError,
      );
      await expect(transactionService.addFunds(request)).rejects.toThrow(
        'does not own the account',
      );
    });
  });

  describe('withdrawFunds', () => {
    it('should withdraw funds from an account successfully', async () => {
      const request = {
        requestingUserId: userId,
        accountNumber: sourceAccountNumber,
        amount: 1000,
        description: 'Withdraw funds test',
      };

      const result = await transactionService.withdrawFunds(request);

      expect(result).toBeDefined();
      expect(result.id).toBe(transactionId);
      expect(result.accountNumber).toBe(sourceAccountNumber);
      expect(result.amount).toBe(1000);
      expect(result.newBalance).toBe(4000); // 5000 - 1000

      const sourceAccount =
        await accountRepository.findByNumber(sourceAccountNumber);
      expect(sourceAccount?.balance).toBe(4000);

      const transactions =
        await transactionRepository.findAllByAccountNumber(sourceAccountNumber);
      expect(transactions).toHaveLength(1);
      expect(transactions[0].id).toBe(transactionId);
      expect(transactions[0].type).toBe('DEBIT');
      expect(transactions[0].amount).toBe(1000);
      expect(transactions[0].source).toBe(sourceAccountNumber);
      expect(transactions[0].target).toBeUndefined();
      expect(transactions[0].description).toBe('Withdraw funds test');
    });

    it('should throw error when account does not exist', async () => {
      const request = {
        requestingUserId: userId,
        accountNumber: 'non-existent-account',
        amount: 1000,
      };

      await expect(transactionService.withdrawFunds(request)).rejects.toThrow(
        NotFoundError,
      );
    });

    it('should throw error when amount is not positive', async () => {
      const request = {
        requestingUserId: userId,
        accountNumber: sourceAccountNumber,
        amount: -1_00,
      };

      await expect(transactionService.withdrawFunds(request)).rejects.toThrow(
        BusinessRuleViolationError,
      );
      await expect(transactionService.withdrawFunds(request)).rejects.toThrow(
        'Amount must be positive',
      );
    });

    it('should throw error when insufficient funds', async () => {
      const request = {
        requestingUserId: userId,
        accountNumber: sourceAccountNumber,
        amount: 100_00, // more than available balance
      };

      await expect(transactionService.withdrawFunds(request)).rejects.toThrow(
        InsufficientFundsError,
      );
    });
  });

  describe('listTransactionsByAccountNumber', () => {
    const date1 = new Date('2023-01-01');
    const date2 = new Date('2023-01-15');
    const date3 = new Date('2023-02-01');

    beforeEach(async () => {
      await transactionRepository.add(
        Transaction.newDebitTransaction()
          .withId('tx-1')
          .withSource(sourceAccountNumber)
          .withAmount(100)
          .withDate(date1)
          .build(),
      );

      await transactionRepository.add(
        Transaction.newCreditTransaction()
          .withId('tx-2')
          .withTarget(sourceAccountNumber)
          .withAmount(200)
          .withDate(date2)
          .build(),
      );

      await transactionRepository.add(
        Transaction.newDebitTransaction()
          .withId('tx-3')
          .withSource(sourceAccountNumber)
          .withAmount(150)
          .withDate(date3)
          .build(),
      );
    });

    it('should list all transactions for an account', async () => {
      const request = {
        requestingUserId: userId,
        accountNumber: sourceAccountNumber,
      };

      const result =
        await transactionService.listTransactionsByAccountNumber(request);

      expect(result).toBeDefined();
      expect(result.transactions).toHaveLength(3);
      expect(result.transactions.map((t) => t.id)).toEqual([
        'tx-1',
        'tx-2',
        'tx-3',
      ]);
    });

    it('should filter transactions by date range', async () => {
      const request = {
        requestingUserId: userId,
        accountNumber: sourceAccountNumber,
        from: new Date('2023-01-10'),
        to: new Date('2023-01-31'),
      };

      const result =
        await transactionService.listTransactionsByAccountNumber(request);

      expect(result).toBeDefined();
      expect(result.transactions).toHaveLength(1);
      expect(result.transactions[0].id).toBe('tx-2');
    });

    it('should throw error when account does not exist', async () => {
      const request = {
        requestingUserId: userId,
        accountNumber: 'non-existent-account',
      };

      await expect(
        transactionService.listTransactionsByAccountNumber(request),
      ).rejects.toThrow(NotFoundError);
    });

    it('should throw error when requesting user does not own the account', async () => {
      const request = {
        requestingUserId: 'different-user-id',
        accountNumber: sourceAccountNumber,
      };

      await expect(
        transactionService.listTransactionsByAccountNumber(request),
      ).rejects.toThrow(BusinessRuleViolationError);
    });
  });
});
