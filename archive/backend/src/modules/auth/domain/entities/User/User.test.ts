import { Id, Username, Email } from '../../../../../core/domain/value-objects';
import { HashedPassword } from '../../value-objects';

import { User } from '.';

describe('User', () => {
  it('should create a user with valid properties', () => {
    const id = new Id('some-id');
    const username = new Username('validUsername');
    const email = new Email('valid@email.com');
    const hashedPassword = new HashedPassword('validPassword');

    const user = User.create({
      id,
      username,
      email,
      hashedPassword: hashedPassword,
    });

    expect(user).toBeInstanceOf(User);
    expect(user.id).toBe(id);
    expect(user.username).toBe(username);
    expect(user.email).toBe(email);
    expect(user.hashedPassword).toBe(hashedPassword);
  });

  it('should throw an error when creating a user with invalid username', () => {
    expect(() => {
      new Username('');
    }).toThrow();
  });

  it('should throw an error when creating a user with invalid email', () => {
    expect(() => {
      new Email('invalid-email');
    }).toThrow();
  });

  it('should throw an error when creating a user with invalid email', () => {
    expect(() => {
      new Email('invalid-email');
    }).toThrow();
  });
});
