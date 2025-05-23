import { User } from '../../modules/auth/domain/entities/User';
import { IUserRepository } from '../../modules/auth/domain/repositories/IUserRepository';
import { HashedPassword } from '../../modules/auth/domain/value-objects';
import { Id, Email, Username } from '../domain/value-objects';

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
    const existingUserIndex = this.users.findIndex((u) => u.id.equals(user.id));

    if (existingUserIndex >= 0) {
      this.users[existingUserIndex] = user;
    } else {
      this.users.push(user);
    }
  }

  async delete(id: Id): Promise<void> {
    this.users = this.users.filter((u) => !u.id.equals(id));
  }

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

  clear(): void {
    this.users = [];
  }
}
