import { Account } from '../entities/Account';
import { BusinessRuleViolationError } from '../errors/BusinessRuleViolationError';
import { InsufficientFundsError } from '../errors/InsufficientFundsError';

describe('Account Entity', () => {
  const userId = 'user-123';
  let account: Account;

  beforeEach(() => {
    account = new Account(
      'acc-123',
      'CHECKING',
      'My Checking Account',
      '1234567890',
      10_00,
      userId,
    );
  });

  describe('constructor', () => {
    it('should create a valid account', () => {
      expect(account).toBeDefined();
      expect(account.id).toBe('acc-123');
      expect(account.type).toBe('CHECKING');
      expect(account.name).toBe('My Checking Account');
      expect(account.number).toBe('1234567890');
      expect(account.balance).toBe(1000);
      expect(account.ownerId).toBe(userId);
    });
  });

  describe('deposit', () => {
    it('should add the amount to the balance', () => {
      const updatedAccount = account.deposit(500);

      expect(updatedAccount.balance).toBe(1500);
      // Original account should not be modified
      expect(account.balance).toBe(1000);
    });

    it('should throw an error when amount is not positive', () => {
      expect(() => account.deposit(0)).toThrow(BusinessRuleViolationError);
      expect(() => account.deposit(-100)).toThrow(BusinessRuleViolationError);
    });

    it('should throw an error with the correct message when amount is zero', () => {
      expect(() => account.deposit(0)).toThrow(
        'Deposit amount must be positive',
      );
    });

    it('should throw an error with the correct message when amount is negative', () => {
      expect(() => account.deposit(-100)).toThrow(
        'Deposit amount must be positive',
      );
    });

    it('should create a new Account instance and not modify the original', () => {
      const updatedAccount = account.deposit(500);

      expect(updatedAccount).not.toBe(account); // Not the same instance
      expect(updatedAccount.id).toBe(account.id);
      expect(updatedAccount.type).toBe(account.type);
      expect(updatedAccount.name).toBe(account.name);
      expect(updatedAccount.number).toBe(account.number);
      expect(updatedAccount.ownerId).toBe(account.ownerId);
      expect(updatedAccount.balance).toBe(1500); // Only balance differs
    });
  });

  describe('withdraw', () => {
    it('should subtract the amount from the balance', () => {
      const updatedAccount = account.withdraw(300);

      expect(updatedAccount.balance).toBe(700);
      // Original account should not be modified
      expect(account.balance).toBe(1000);
    });

    it('should throw an error when amount is not positive', () => {
      expect(() => account.withdraw(0)).toThrow(BusinessRuleViolationError);
      expect(() => account.withdraw(-100)).toThrow(BusinessRuleViolationError);
    });

    it('should throw an error with the correct message when amount is zero', () => {
      expect(() => account.withdraw(0)).toThrow(
        'Withdrawal amount must be positive',
      );
    });

    it('should throw an error with the correct message when amount is negative', () => {
      expect(() => account.withdraw(-100)).toThrow(
        'Withdrawal amount must be positive',
      );
    });

    it('should throw InsufficientFundsError when balance is less than amount', () => {
      expect(() => account.withdraw(1001)).toThrow(InsufficientFundsError);
    });

    it('should create a new Account instance and not modify the original', () => {
      const updatedAccount = account.withdraw(300);

      expect(updatedAccount).not.toBe(account); // Not the same instance
      expect(updatedAccount.id).toBe(account.id);
      expect(updatedAccount.type).toBe(account.type);
      expect(updatedAccount.name).toBe(account.name);
      expect(updatedAccount.number).toBe(account.number);
      expect(updatedAccount.ownerId).toBe(account.ownerId);
      expect(updatedAccount.balance).toBe(700); // Only balance differs
    });

    it('should allow withdrawal of the exact balance amount', () => {
      const updatedAccount = account.withdraw(1000);
      expect(updatedAccount.balance).toBe(0);
    });
  });
});
