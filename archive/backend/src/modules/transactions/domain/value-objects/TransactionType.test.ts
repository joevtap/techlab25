import { TransactionType, TransactionTypeEnum } from './TransactionType';

describe('TransactionType', () => {
  describe('constructor', () => {
    it('should create a TransactionType with a valid enum value', () => {
      const typeValues: TransactionTypeEnum[] = ['DEBIT', 'CREDIT', 'TRANSFER'];

      typeValues.forEach((typeValue) => {
        const transactionType = new TransactionType(typeValue);

        expect(transactionType).toBeInstanceOf(TransactionType);
        expect(transactionType.toString()).toBe(typeValue);
      });
    });
  });

  describe('equals', () => {
    it('should return true when comparing TransactionTypes with the same value', () => {
      const typeValue: TransactionTypeEnum = 'DEBIT';
      const transactionType1 = new TransactionType(typeValue);
      const transactionType2 = new TransactionType(typeValue);

      expect(transactionType1.equals(transactionType2)).toBe(true);
    });

    it('should return false when comparing TransactionTypes with different values', () => {
      const transactionType1 = new TransactionType('DEBIT');
      const transactionType2 = new TransactionType('CREDIT');

      expect(transactionType1.equals(transactionType2)).toBe(false);
    });
  });

  describe('toString', () => {
    it('should return the enum value of the TransactionType', () => {
      const typeValues: TransactionTypeEnum[] = ['DEBIT', 'CREDIT', 'TRANSFER'];

      typeValues.forEach((typeValue) => {
        const transactionType = new TransactionType(typeValue);
        expect(transactionType.toString()).toBe(typeValue);
      });
    });
  });
});
