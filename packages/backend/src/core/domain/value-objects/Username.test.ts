import { Username } from './Username';

describe('Username', () => {
  describe('create', () => {
    it('should create a valid Username when given a valid string', () => {
      const username = Username.create('validUsername');
      expect(username).toBeInstanceOf(Username);
      expect(username.value).toBe('validUsername');
    });

    it('should throw an error when given a string that is too short', () => {
      expect(() => Username.create('ab')).toThrow();
    });

    it('should throw an error when given a string that is too long', () => {
      const tooLongUsername = 'a'.repeat(256);
      expect(() => Username.create(tooLongUsername)).toThrow();
    });

    it('should throw an error when given a non-string value', () => {
      // @ts-expect-error Testing invalid input
      expect(() => Username.create(123)).toThrow();
    });
  });

  describe('equals', () => {
    it('should return true when comparing two usernames with the same value', () => {
      const username1 = Username.create('sameUsername');
      const username2 = Username.create('sameUsername');
      expect(username1.equals(username2)).toBe(true);
    });

    it('should return false when comparing two usernames with different values', () => {
      const username1 = Username.create('username1');
      const username2 = Username.create('username2');
      expect(username1.equals(username2)).toBe(false);
    });
  });

  describe('toString', () => {
    it('should return the string value of the username', () => {
      const usernameValue = 'testUsername';
      const username = Username.create(usernameValue);
      expect(username.toString()).toBe(usernameValue);
    });
  });
});
