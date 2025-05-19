import { Id, Email, Username } from '../../../../../core/domain/value-objects';
import { User } from '../../../domain/entities/User';
import { IUserRepository } from '../../../domain/repositories/IUserRepository';
import { HashedPassword } from '../../../domain/value-objects';

export class MockUserRepository implements IUserRepository {
  public users: User[] = [];

  async findById(id: Id): Promise<User | null> {
    const user = this.users.find((u) => u.id.equals(id));
    return user || null;
  }

  async findByEmail(email: Email): Promise<User | null> {
    const user = this.users.find((u) => u.email.equals(email));
    return user || null;
  }

  async save(user: User): Promise<void> {
    // Check if user already exists (by ID)
    const existingUserIndex = this.users.findIndex((u) => u.id.equals(user.id));

    if (existingUserIndex >= 0) {
      // Replace existing user
      this.users[existingUserIndex] = user;
    } else {
      // Add new user
      this.users.push(user);
    }
  }

  async delete(id: Id): Promise<void> {
    this.users = this.users.filter((u) => !u.id.equals(id));
  }

  // Helper method for tests to add existing users more easily
  async addExistingUser(userData: {
    id?: string;
    email: string;
    username?: string;
    password?: string;
  }): Promise<User> {
    const id = new Id(userData.id || `existing-id-${this.users.length + 1}`);
    const email = new Email(userData.email);
    const username = new Username(
      userData.username || `existing-user-${this.users.length + 1}`,
    );
    const hashedPassword = new HashedPassword(
      userData.password
        ? `hashed_${userData.password}`
        : 'hashed_default_password',
    );

    const user = User.create({
      id,
      email,
      username,
      hashedPassword,
    });

    await this.save(user);
    return user;
  }

  // Clear all users (useful for test setup/teardown)
  clear(): void {
    this.users = [];
  }
}
