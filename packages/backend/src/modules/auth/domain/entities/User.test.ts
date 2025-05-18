import { User } from './User';
import { Username, Email } from '@core/domain/value-objects';

describe('User', () => {
  it('should create a user with valid properties', () => {
    const id = 'some-id';
    const username = Username.create('validUsername');
    const email = Email.create('valid@email.com');
    const passwordHash = 'validPassword';

    const user = User.create({
      id,
      username,
      email,
      passwordHash,
    });

    expect(user).toBeInstanceOf(User);
    expect(user.id).toBe(id);
    expect(user.username).toBe(username);
    expect(user.email).toBe(email);
    expect(user.passwordHash).toBe(passwordHash);
  });

  it('should throw an error when creating a user with invalid username', () => {
    expect(() => {
      Username.create('');
    }).toThrow();
  });

  it('should throw an error when creating a user with invalid email', () => {
    expect(() => {
      Email.create('invalid-email');
    }).toThrow();
  });
});
