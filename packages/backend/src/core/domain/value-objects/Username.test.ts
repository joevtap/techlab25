import { Username } from './Username';

describe('Username', () => {
  describe('create', () => {
    it('should create a valid Username when given a valid string', () => {
      const username = new Username('validUsername');
      expect(username).toBeInstanceOf(Username);
      expect(username.toString()).toBe('validUsername');
    });

    it('should throw an error when given a string that is too short', () => {
      expect(() => new Username('ab')).toThrow();
    });

    it('should throw an error when given a string that is too long', () => {
      const tooLongUsername = 'a'.repeat(256);
      expect(() => new Username(tooLongUsername)).toThrow();
    });

    it('should throw an error when given a non-string value', () => {
      // @ts-expect-error Testing invalid input
      expect(() => new Username(123)).toThrow();
    });
  });

  describe('equals', () => {
    it('should return true when comparing two usernames with the same value', () => {
      const username1 = new Username('sameUsername');
      const username2 = new Username('sameUsername');
      expect(username1.equals(username2)).toBe(true);
    });

    it('should return false when comparing two usernames with different values', () => {
      const username1 = new Username('username1');
      const username2 = new Username('username2');
      expect(username1.equals(username2)).toBe(false);
    });
  });

  describe('toString', () => {
    it('should return the string value of the username', () => {
      const usernameValue = 'testUsername';
      const username = new Username(usernameValue);
      expect(username.toString()).toBe(usernameValue);
    });
  });
});
