import { Description } from './Description';

describe('Description', () => {
  describe('constructor', () => {
    it('should create a Description with a string value', () => {
      const descriptionText = 'Test description';
      const description = new Description(descriptionText);

      expect(description).toBeInstanceOf(Description);
      expect(description.toString()).toBe(descriptionText);
    });

    it('should allow undefined values', () => {
      const description = new Description();

      expect(description).toBeInstanceOf(Description);
      expect(description.toString()).toBeUndefined();
    });
  });

  describe('equals', () => {
    it('should return true when comparing Descriptions with the same value', () => {
      const descriptionText = 'Same description';
      const description1 = new Description(descriptionText);
      const description2 = new Description(descriptionText);

      expect(description1.equals(description2)).toBe(true);
    });

    it('should return false when comparing Descriptions with different values', () => {
      const description1 = new Description('Description 1');
      const description2 = new Description('Description 2');

      expect(description1.equals(description2)).toBe(false);
    });

    it('should return true when comparing two undefined descriptions', () => {
      const description1 = new Description();
      const description2 = new Description();

      expect(description1.equals(description2)).toBe(true);
    });

    it('should return false when comparing undefined and defined descriptions', () => {
      const description1 = new Description();
      const description2 = new Description('Some description');

      expect(description1.equals(description2)).toBe(false);
    });
  });

  describe('toString', () => {
    it('should return the string value of the Description', () => {
      const descriptionText = 'Test description';
      const description = new Description(descriptionText);

      expect(description.toString()).toBe(descriptionText);
    });

    it('should return undefined when description is undefined', () => {
      const description = new Description();

      expect(description.toString()).toBeUndefined();
    });
  });
});
