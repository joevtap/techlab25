import { TransactionDate } from './TransactionDate';

describe('TransactionDate', () => {
  describe('constructor', () => {
    it('should create a TransactionDate with a Date object', () => {
      const dateValue = new Date('2025-01-15T12:00:00Z');
      const transactionDate = new TransactionDate(dateValue);

      expect(transactionDate).toBeInstanceOf(TransactionDate);
      expect(transactionDate.getValue()).toBe(dateValue);
    });
  });

  describe('equals', () => {
    it('should return true when comparing TransactionDates with the same value', () => {
      const dateValue = new Date('2025-01-15T12:00:00Z');
      const date1 = new TransactionDate(dateValue);
      const date2 = new TransactionDate(dateValue);

      expect(date1.equals(date2)).toBe(true);
    });

    it('should return false when comparing TransactionDates with different values', () => {
      const date1 = new TransactionDate(new Date('2025-01-15T12:00:00Z'));
      const date2 = new TransactionDate(new Date('2025-01-16T12:00:00Z'));

      expect(date1.equals(date2)).toBe(false);
    });
  });

  describe('getValue', () => {
    it('should return the Date value of the TransactionDate', () => {
      const dateValue = new Date('2025-01-15T12:00:00Z');
      const transactionDate = new TransactionDate(dateValue);

      expect(transactionDate.getValue()).toBe(dateValue);
    });
  });

  describe('toTimestamp', () => {
    it('should return the timestamp value of the TransactionDate', () => {
      const dateValue = new Date('2025-01-15T12:00:00Z');
      const transactionDate = new TransactionDate(dateValue);

      expect(transactionDate.toTimestamp()).toBe(dateValue.getTime());
    });
  });

  describe('toString', () => {
    it('should return the UTC string representation of the date', () => {
      const dateValue = new Date('2025-01-15T12:00:00Z');
      const transactionDate = new TransactionDate(dateValue);

      expect(transactionDate.toString()).toBe(dateValue.toUTCString());
    });
  });
});
