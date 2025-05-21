import { HashedPassword } from './HashedPassword';

describe('HashedPassword', () => {
  describe('constructor', () => {
    it('should create a HashedPassword with a string value', () => {
      const passwordValue = 'hashed-password-123';
      const hashedPassword = new HashedPassword(passwordValue);

      expect(hashedPassword).toBeInstanceOf(HashedPassword);
      expect(hashedPassword.toString()).toBe(passwordValue);
    });
  });

  describe('equals', () => {
    it('should return true when comparing HashedPasswords with the same value', () => {
      const passwordValue = 'same-hashed-password';
      const password1 = new HashedPassword(passwordValue);
      const password2 = new HashedPassword(passwordValue);

      expect(password1.equals(password2)).toBe(true);
    });

    it('should return false when comparing HashedPasswords with different values', () => {
      const password1 = new HashedPassword('hashed-password-1');
      const password2 = new HashedPassword('hashed-password-2');

      expect(password1.equals(password2)).toBe(false);
    });
  });

  describe('toString', () => {
    it('should return the string value of the HashedPassword', () => {
      const passwordValue = 'test-hashed-password-456';
      const hashedPassword = new HashedPassword(passwordValue);

      expect(hashedPassword.toString()).toBe(passwordValue);
    });
  });
});
