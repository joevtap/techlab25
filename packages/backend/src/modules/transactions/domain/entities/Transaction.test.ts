import { BaseEntity } from '../../../../core/domain/entities';
import { Id } from '../../../../core/domain/value-objects';
import { AccountNumber } from '../value-objects/AccountNumber';
import { Description } from '../value-objects/Description';
import { TransactionDate } from '../value-objects/TransactionDate';
import { TransactionValue } from '../value-objects/TransactionValue';

import { Transaction } from './Transaction';

describe('Transaction', () => {
  const mockId = new Id('transaction-id');
  const mockFromId = new Id('from-account-id');
  const mockToId = new Id('to-account-id');
  const mockFromAccountNumber = new AccountNumber('123456789');
  const mockToAccountNumber = new AccountNumber('987654321');
  const mockValue = new TransactionValue(10000); // 100.00 BRL
  const mockDescription = new Description('Test transaction');
  const mockCreatedAt = new TransactionDate(new Date());

  describe('transfer', () => {
    it('should create a transfer transaction with valid properties', () => {
      const transaction = Transaction.transfer({
        id: mockId,
        fromId: mockFromId,
        fromAccountNumber: mockFromAccountNumber,
        toId: mockToId,
        toAccountNumber: mockToAccountNumber,
        value: mockValue,
        description: mockDescription,
        createdAt: mockCreatedAt,
      });

      expect(transaction).toBeInstanceOf(Transaction);
      expect(transaction).toBeInstanceOf(BaseEntity);
      expect(transaction.id).toBe(mockId);
      expect(transaction.fromId).toBe(mockFromId);
      expect(transaction.fromAccountNumber).toBe(mockFromAccountNumber);
      expect(transaction.toId).toBe(mockToId);
      expect(transaction.toAccountNumber).toBe(mockToAccountNumber);
      expect(transaction.value).toBe(mockValue);
      expect(transaction.description).toBe(mockDescription);
      expect(transaction.createdAt).toBe(mockCreatedAt);
      expect(transaction.type.toString()).toBe('TRANSFER');
      expect(transaction.isTransfer()).toBe(true);
      expect(transaction.isDebit()).toBe(false);
      expect(transaction.isCredit()).toBe(false);
    });
  });

  describe('debit', () => {
    it('should create a debit transaction with valid properties', () => {
      const transaction = Transaction.debit({
        id: mockId,
        fromId: mockFromId,
        fromAccountNumber: mockFromAccountNumber,
        value: mockValue,
        description: mockDescription,
        createdAt: mockCreatedAt,
      });

      expect(transaction).toBeInstanceOf(Transaction);
      expect(transaction.id).toBe(mockId);
      expect(transaction.fromId).toBe(mockFromId);
      expect(transaction.fromAccountNumber).toBe(mockFromAccountNumber);
      expect(transaction.toId).toBeUndefined();
      expect(transaction.toAccountNumber).toBeUndefined();
      expect(transaction.value).toBe(mockValue);
      expect(transaction.description).toBe(mockDescription);
      expect(transaction.createdAt).toBe(mockCreatedAt);
      expect(transaction.type.toString()).toBe('DEBIT');
      expect(transaction.isTransfer()).toBe(false);
      expect(transaction.isDebit()).toBe(true);
      expect(transaction.isCredit()).toBe(false);
    });
  });

  describe('credit', () => {
    it('should create a credit transaction with valid properties', () => {
      const transaction = Transaction.credit({
        id: mockId,
        toId: mockToId,
        toAccountNumber: mockToAccountNumber,
        value: mockValue,
        description: mockDescription,
        createdAt: mockCreatedAt,
      });

      expect(transaction).toBeInstanceOf(Transaction);
      expect(transaction.id).toBe(mockId);
      expect(transaction.fromId).toBeUndefined();
      expect(transaction.fromAccountNumber).toBeUndefined();
      expect(transaction.toId).toBe(mockToId);
      expect(transaction.toAccountNumber).toBe(mockToAccountNumber);
      expect(transaction.value).toBe(mockValue);
      expect(transaction.description).toBe(mockDescription);
      expect(transaction.createdAt).toBe(mockCreatedAt);
      expect(transaction.type.toString()).toBe('CREDIT');
      expect(transaction.isTransfer()).toBe(false);
      expect(transaction.isDebit()).toBe(false);
      expect(transaction.isCredit()).toBe(true);
    });
  });

  describe('transaction type checks', () => {
    it('should correctly identify transaction types', () => {
      const transfer = Transaction.transfer({
        id: mockId,
        fromId: mockFromId,
        fromAccountNumber: mockFromAccountNumber,
        toId: mockToId,
        toAccountNumber: mockToAccountNumber,
        value: mockValue,
        createdAt: mockCreatedAt,
      });

      const debit = Transaction.debit({
        id: mockId,
        fromId: mockFromId,
        fromAccountNumber: mockFromAccountNumber,
        value: mockValue,
        createdAt: mockCreatedAt,
      });

      const credit = Transaction.credit({
        id: mockId,
        toId: mockToId,
        toAccountNumber: mockToAccountNumber,
        value: mockValue,
        createdAt: mockCreatedAt,
      });

      expect(transfer.isTransfer()).toBe(true);
      expect(transfer.isDebit()).toBe(false);
      expect(transfer.isCredit()).toBe(false);

      expect(debit.isTransfer()).toBe(false);
      expect(debit.isDebit()).toBe(true);
      expect(debit.isCredit()).toBe(false);

      expect(credit.isTransfer()).toBe(false);
      expect(credit.isDebit()).toBe(false);
      expect(credit.isCredit()).toBe(true);
    });
  });
});
