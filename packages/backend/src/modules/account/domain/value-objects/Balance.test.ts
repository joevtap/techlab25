import { Balance } from './Balance';

describe('Balance', () => {
  describe('constructor', () => {
    it('should create a Balance with a number value', () => {
      const balanceValue = 10000; // 100.00 BRL
      const balance = new Balance(balanceValue);

      expect(balance).toBeInstanceOf(Balance);
      expect(balance.getValue()).toBe(balanceValue);
    });
  });

  describe('equals', () => {
    it('should return true when comparing Balances with the same value', () => {
      const balanceValue = 10000; // 100.00 BRL
      const balance1 = new Balance(balanceValue);
      const balance2 = new Balance(balanceValue);

      expect(balance1.equals(balance2)).toBe(true);
    });

    it('should return false when comparing Balances with different values', () => {
      const balance1 = new Balance(10000); // 100.00 BRL
      const balance2 = new Balance(20000); // 200.00 BRL

      expect(balance1.equals(balance2)).toBe(false);
    });
  });

  describe('getValue', () => {
    it('should return the numeric value of the Balance', () => {
      const balanceValue = 10000; // 100.00 BRL
      const balance = new Balance(balanceValue);

      expect(balance.getValue()).toBe(balanceValue);
    });
  });

  describe('toString', () => {
    it('should return the formatted string value of the Balance', () => {
      const balanceValue = 10000; // 100.00 BRL
      const balance = new Balance(balanceValue);

      expect(balance.toString()).toBe('100.00 BRL');
    });

    it('should format decimal values correctly', () => {
      const balance = new Balance(10050); // 100.50 BRL
      expect(balance.toString()).toBe('100.50 BRL');
    });

    it('should format small values correctly', () => {
      const balance = new Balance(1); // 0.01 BRL
      expect(balance.toString()).toBe('0.01 BRL');
    });
  });
});
