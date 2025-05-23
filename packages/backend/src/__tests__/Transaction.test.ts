import { Transaction } from '../entities/Transaction';
import { BusinessRuleViolationError } from '../errors/BusinessRuleViolationError';

describe('Transaction Entity', () => {
  const transactionId = 'tx-123';
  const sourceAccount = '1234567890';
  const targetAccount = '0987654321';
  const amount = 10_00;
  const description = 'Test transaction';
  const testDate = new Date('2023-01-01T12:00:00Z');

  describe('Transfer Transaction', () => {
    it('should create a valid transfer transaction', () => {
      const transaction = Transaction.newTransfer()
        .withId(transactionId)
        .withSource(sourceAccount)
        .withTarget(targetAccount)
        .withAmount(amount)
        .withDescription(description)
        .withDate(testDate)
        .build();

      expect(transaction).toBeDefined();
      expect(transaction.id).toBe(transactionId);
      expect(transaction.source).toBe(sourceAccount);
      expect(transaction.target).toBe(targetAccount);
      expect(transaction.amount).toBe(amount);
      expect(transaction.type).toBe('TRANSFER');
      expect(transaction.description).toBe(description);
      expect(transaction.date).toBe(testDate);
    });

    it('should throw error when source account is missing', () => {
      const builder = Transaction.newTransfer()
        .withId(transactionId)
        .withTarget(targetAccount)
        .withAmount(amount);

      expect(() => builder.build()).toThrow(BusinessRuleViolationError);
      expect(() => builder.build()).toThrow('requires a source account');
    });

    it('should throw error when target account is missing', () => {
      const builder = Transaction.newTransfer()
        .withId(transactionId)
        .withSource(sourceAccount)
        .withAmount(amount);

      expect(() => builder.build()).toThrow(BusinessRuleViolationError);
      expect(() => builder.build()).toThrow('requires a target account');
    });

    it('should use current date if date is not provided', () => {
      jest.useFakeTimers().setSystemTime(new Date('2023-05-15T10:00:00Z'));

      const transaction = Transaction.newTransfer()
        .withId(transactionId)
        .withSource(sourceAccount)
        .withTarget(targetAccount)
        .withAmount(amount)
        .build();

      expect(transaction.date).toEqual(new Date('2023-05-15T10:00:00Z'));

      jest.useRealTimers();
    });
  });

  describe('Credit Transaction', () => {
    it('should create a valid credit transaction', () => {
      const transaction = Transaction.newCreditTransaction()
        .withId(transactionId)
        .withTarget(targetAccount)
        .withAmount(amount)
        .withDescription(description)
        .withDate(testDate)
        .build();

      expect(transaction).toBeDefined();
      expect(transaction.id).toBe(transactionId);
      expect(transaction.source).toBeUndefined();
      expect(transaction.target).toBe(targetAccount);
      expect(transaction.amount).toBe(amount);
      expect(transaction.type).toBe('CREDIT');
      expect(transaction.description).toBe(description);
      expect(transaction.date).toBe(testDate);
    });

    it('should throw error when target account is missing', () => {
      const builder = Transaction.newCreditTransaction()
        .withId(transactionId)
        .withAmount(amount);

      expect(() => builder.build()).toThrow(BusinessRuleViolationError);
      expect(() => builder.build()).toThrow('requires a target account');
    });

    it('should ignore source account setting for credit transactions', () => {
      const transaction = Transaction.newCreditTransaction()
        .withId(transactionId)
        .withTarget(targetAccount)
        .withAmount(amount)
        .withSource(sourceAccount) // This should be ignored
        .build();

      expect(transaction.source).toBeUndefined();
    });
  });

  describe('Debit Transaction', () => {
    it('should create a valid debit transaction', () => {
      const transaction = Transaction.newDebitTransaction()
        .withId(transactionId)
        .withSource(sourceAccount)
        .withAmount(amount)
        .withDescription(description)
        .withDate(testDate)
        .build();

      expect(transaction).toBeDefined();
      expect(transaction.id).toBe(transactionId);
      expect(transaction.source).toBe(sourceAccount);
      expect(transaction.target).toBeUndefined();
      expect(transaction.amount).toBe(amount);
      expect(transaction.type).toBe('DEBIT');
      expect(transaction.description).toBe(description);
      expect(transaction.date).toBe(testDate);
    });

    it('should throw error when source account is missing', () => {
      const builder = Transaction.newDebitTransaction()
        .withId(transactionId)
        .withAmount(amount);

      expect(() => builder.build()).toThrow(BusinessRuleViolationError);
      expect(() => builder.build()).toThrow('requires a source account');
    });

    it('should ignore target account setting for debit transactions', () => {
      const transaction = Transaction.newDebitTransaction()
        .withId(transactionId)
        .withSource(sourceAccount)
        .withAmount(amount)
        .withTarget(targetAccount) // This should be ignored
        .build();

      expect(transaction.target).toBeUndefined();
    });
  });
});
