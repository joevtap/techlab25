import { User } from '../entities/User';

describe('User Entity', () => {
  it('should create a valid user', () => {
    const user = new User(
      'user-123',
      'test@example.com',
      'testuser',
      'hashed_password123',
    );

    expect(user).toBeDefined();
    expect(user.id).toBe('user-123');
    expect(user.email).toBe('test@example.com');
    expect(user.username).toBe('testuser');
    expect(user.password).toBe('hashed_password123');
  });
});
