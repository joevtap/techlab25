import { AccountType, AccountTypeEnum } from './AccountType';

describe('AccountType', () => {
  describe('constructor', () => {
    it('should create an AccountType with a valid enum value', () => {
      const typeValues: AccountTypeEnum[] = [
        'CHECKING',
        'SAVINGS',
        'INVESTMENTS',
      ];

      typeValues.forEach((typeValue) => {
        const accountType = new AccountType(typeValue);

        expect(accountType).toBeInstanceOf(AccountType);
        expect(accountType.toString()).toBe(typeValue);
      });
    });
  });

  describe('equals', () => {
    it('should return true when comparing AccountTypes with the same value', () => {
      const typeValue: AccountTypeEnum = 'CHECKING';
      const accountType1 = new AccountType(typeValue);
      const accountType2 = new AccountType(typeValue);

      expect(accountType1.equals(accountType2)).toBe(true);
    });

    it('should return false when comparing AccountTypes with different values', () => {
      const accountType1 = new AccountType('CHECKING');
      const accountType2 = new AccountType('SAVINGS');

      expect(accountType1.equals(accountType2)).toBe(false);
    });
  });

  describe('toString', () => {
    it('should return the enum value of the AccountType', () => {
      const typeValues: AccountTypeEnum[] = [
        'CHECKING',
        'SAVINGS',
        'INVESTMENTS',
      ];

      typeValues.forEach((typeValue) => {
        const accountType = new AccountType(typeValue);
        expect(accountType.toString()).toBe(typeValue);
      });
    });
  });
});
