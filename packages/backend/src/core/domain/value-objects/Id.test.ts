import { Id } from './Id';

describe('Id', () => {
  describe('constructor', () => {
    it('should create a valid Id with a string value', () => {
      const idValue = 'test-id-123';
      const id = new Id(idValue);

      expect(id).toBeInstanceOf(Id);
      expect(id.toString()).toBe(idValue);
    });
  });

  describe('equals', () => {
    it('should return true when comparing Ids with the same value', () => {
      const idValue = 'same-id-value';
      const id1 = new Id(idValue);
      const id2 = new Id(idValue);

      expect(id1.equals(id2)).toBe(true);
    });

    it('should return false when comparing Ids with different values', () => {
      const id1 = new Id('id-1');
      const id2 = new Id('id-2');

      expect(id1.equals(id2)).toBe(false);
    });
  });

  describe('toString', () => {
    it('should return the string value of the Id', () => {
      const idValue = 'test-id-456';
      const id = new Id(idValue);

      expect(id.toString()).toBe(idValue);
    });
  });
});
