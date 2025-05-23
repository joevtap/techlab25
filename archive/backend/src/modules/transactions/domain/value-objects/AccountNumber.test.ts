import { AccountNumber } from './AccountNumber';

describe('AccountNumber', () => {
  describe('constructor', () => {
    it('should create an AccountNumber with a string value', () => {
      const accountNumberValue = '123456789';
      const accountNumber = new AccountNumber(accountNumberValue);

      expect(accountNumber).toBeInstanceOf(AccountNumber);
      expect(accountNumber.toString()).toBe(accountNumberValue);
    });
  });

  describe('equals', () => {
    it('should return true when comparing AccountNumbers with the same value', () => {
      const accountNumberValue = '123456789';
      const accountNumber1 = new AccountNumber(accountNumberValue);
      const accountNumber2 = new AccountNumber(accountNumberValue);

      expect(accountNumber1.equals(accountNumber2)).toBe(true);
    });

    it('should return false when comparing AccountNumbers with different values', () => {
      const accountNumber1 = new AccountNumber('123456789');
      const accountNumber2 = new AccountNumber('987654321');

      expect(accountNumber1.equals(accountNumber2)).toBe(false);
    });
  });

  describe('toString', () => {
    it('should return the string value of the AccountNumber', () => {
      const accountNumberValue = '123456789';
      const accountNumber = new AccountNumber(accountNumberValue);

      expect(accountNumber.toString()).toBe(accountNumberValue);
    });
  });
});
