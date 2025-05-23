import { BaseEntity } from '../../../../core/domain/entities';
import { ValidationError } from '../../../../core/domain/errors';
import { Id } from '../../../../core/domain/value-objects/Id';
import { InsufficientFundsError } from '../errors/InsufficientFundsError';
import { AccountNumber } from '../value-objects/AccountNumber';
import { AccountType } from '../value-objects/AccountType';
import { Balance } from '../value-objects/Balance';
import { Currency } from '../value-objects/Currency';

import { Account } from './Account';

describe('Account', () => {
  const mockId = new Id('account-id');
  const mockAccountNumber = new AccountNumber('123456789');
  const mockAccountType = new AccountType('CHECKING');
  const mockBalance = new Balance(10000); // 100.00 BRL
  const mockOwnerId = new Id('owner-id');

  describe('create', () => {
    it('should create an account with valid properties', () => {
      const account = Account.create({
        id: mockId,
        accountNumber: mockAccountNumber,
        type: mockAccountType,
        balance: mockBalance,
        ownerId: mockOwnerId,
      });

      expect(account).toBeInstanceOf(Account);
      expect(account).toBeInstanceOf(BaseEntity);
      expect(account.id).toBe(mockId);
      expect(account.accountNumber).toBe(mockAccountNumber);
      expect(account.type).toBe(mockAccountType);
      expect(account.balance).toBe(mockBalance);
      expect(account.ownerId).toBe(mockOwnerId);
    });
  });

  describe('deposit', () => {
    it('should add the amount to the balance and return a new account instance', () => {
      const account = Account.create({
        id: mockId,
        accountNumber: mockAccountNumber,
        type: mockAccountType,
        balance: new Balance(10000), // 100.00 BRL
        ownerId: mockOwnerId,
      });

      const depositAmount = new Currency(5000); // 50.00 BRL
      const updatedAccount = account.deposit(depositAmount);

      expect(updatedAccount).toBeInstanceOf(Account);
      expect(updatedAccount).not.toBe(account); // Should be a new instance
      expect(updatedAccount.balance.getValue()).toBe(15000); // 150.00 BRL
      expect(updatedAccount.id).toBe(account.id);
      expect(updatedAccount.accountNumber).toBe(account.accountNumber);
      expect(updatedAccount.type).toBe(account.type);
      expect(updatedAccount.ownerId).toBe(account.ownerId);
    });

    it('should throw ValidationError when deposit amount is zero or negative', () => {
      const account = Account.create({
        id: mockId,
        accountNumber: mockAccountNumber,
        type: mockAccountType,
        balance: mockBalance,
        ownerId: mockOwnerId,
      });

      const zeroAmount = new Currency(0);
      const negativeAmount = new Currency(-1000);

      expect(() => account.deposit(zeroAmount)).toThrow(ValidationError);
      expect(() => account.deposit(negativeAmount)).toThrow(ValidationError);
    });
  });

  describe('withdraw', () => {
    it('should subtract the amount from the balance and return a new account instance', () => {
      const account = Account.create({
        id: mockId,
        accountNumber: mockAccountNumber,
        type: mockAccountType,
        balance: new Balance(10000), // 100.00 BRL
        ownerId: mockOwnerId,
      });

      const withdrawAmount = new Currency(3000); // 30.00 BRL
      const updatedAccount = account.withdraw(withdrawAmount);

      expect(updatedAccount).toBeInstanceOf(Account);
      expect(updatedAccount).not.toBe(account); // Should be a new instance
      expect(updatedAccount.balance.getValue()).toBe(7000); // 70.00 BRL
      expect(updatedAccount.id).toBe(account.id);
      expect(updatedAccount.accountNumber).toBe(account.accountNumber);
      expect(updatedAccount.type).toBe(account.type);
      expect(updatedAccount.ownerId).toBe(account.ownerId);
    });

    it('should throw ValidationError when withdrawal amount is zero or negative', () => {
      const account = Account.create({
        id: mockId,
        accountNumber: mockAccountNumber,
        type: mockAccountType,
        balance: mockBalance,
        ownerId: mockOwnerId,
      });

      const zeroAmount = new Currency(0);
      const negativeAmount = new Currency(-1000);

      expect(() => account.withdraw(zeroAmount)).toThrow(ValidationError);
      expect(() => account.withdraw(negativeAmount)).toThrow(ValidationError);
    });

    it('should throw InsufficientFundsError when withdrawal amount exceeds balance', () => {
      const account = Account.create({
        id: mockId,
        accountNumber: mockAccountNumber,
        type: mockAccountType,
        balance: new Balance(5000), // 50.00 BRL
        ownerId: mockOwnerId,
      });

      const exceedingAmount = new Currency(6000); // 60.00 BRL

      expect(() => account.withdraw(exceedingAmount)).toThrow(
        InsufficientFundsError,
      );
    });
  });
});
