import { Currency } from './Currency';

describe('Currency', () => {
  describe('constructor', () => {
    it('should create a Currency with a number value', () => {
      const currencyValue = 10000; // 100.00 BRL
      const currency = new Currency(currencyValue);

      expect(currency).toBeInstanceOf(Currency);
      expect(currency.getValue()).toBe(currencyValue);
    });
  });

  describe('equals', () => {
    it('should return true when comparing Currency with the same value', () => {
      const currencyValue = 10000; // 100.00 BRL
      const currency1 = new Currency(currencyValue);
      const currency2 = new Currency(currencyValue);

      expect(currency1.equals(currency2)).toBe(true);
    });

    it('should return false when comparing Currency with different values', () => {
      const currency1 = new Currency(10000); // 100.00 BRL
      const currency2 = new Currency(20000); // 200.00 BRL

      expect(currency1.equals(currency2)).toBe(false);
    });
  });

  describe('getValue', () => {
    it('should return the numeric value of the Currency', () => {
      const currencyValue = 10000; // 100.00 BRL
      const currency = new Currency(currencyValue);

      expect(currency.getValue()).toBe(currencyValue);
    });
  });

  describe('toString', () => {
    it('should return the formatted string value of the Currency', () => {
      const currencyValue = 10000; // 100.00 BRL
      const currency = new Currency(currencyValue);

      expect(currency.toString()).toBe('100.00 BRL');
    });

    it('should format decimal values correctly', () => {
      const currency = new Currency(10050); // 100.50 BRL
      expect(currency.toString()).toBe('100.50 BRL');
    });

    it('should format small values correctly', () => {
      const currency = new Currency(1); // 0.01 BRL
      expect(currency.toString()).toBe('0.01 BRL');
    });
  });
});
