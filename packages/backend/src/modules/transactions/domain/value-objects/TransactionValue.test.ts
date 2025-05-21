import { TransactionValue } from './TransactionValue';

describe('TransactionValue', () => {
  describe('constructor', () => {
    it('should create a TransactionValue with a number value', () => {
      const valueAmount = 10000; // 100.00 BRL
      const value = new TransactionValue(valueAmount);

      expect(value).toBeInstanceOf(TransactionValue);
      expect(value.getValue()).toBe(valueAmount);
    });
  });

  describe('equals', () => {
    it('should return true when comparing TransactionValues with the same value', () => {
      const valueAmount = 10000; // 100.00 BRL
      const value1 = new TransactionValue(valueAmount);
      const value2 = new TransactionValue(valueAmount);

      expect(value1.equals(value2)).toBe(true);
    });

    it('should return false when comparing TransactionValues with different values', () => {
      const value1 = new TransactionValue(10000); // 100.00 BRL
      const value2 = new TransactionValue(20000); // 200.00 BRL

      expect(value1.equals(value2)).toBe(false);
    });
  });

  describe('getValue', () => {
    it('should return the numeric value of the TransactionValue', () => {
      const valueAmount = 10000; // 100.00 BRL
      const value = new TransactionValue(valueAmount);

      expect(value.getValue()).toBe(valueAmount);
    });
  });

  describe('toString', () => {
    it('should return the formatted string value of the TransactionValue', () => {
      const valueAmount = 10000; // 100.00 BRL
      const value = new TransactionValue(valueAmount);

      expect(value.toString()).toBe('100.00 BRL');
    });

    it('should format decimal values correctly', () => {
      const value = new TransactionValue(10050); // 100.50 BRL
      expect(value.toString()).toBe('100.50 BRL');
    });

    it('should format small values correctly', () => {
      const value = new TransactionValue(1); // 0.01 BRL
      expect(value.toString()).toBe('0.01 BRL');
    });
  });
});
