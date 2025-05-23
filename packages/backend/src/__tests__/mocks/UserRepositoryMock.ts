import { Email, Id } from '../../entities/types';
import { User } from '../../entities/User';
import { IUserRepository } from '../../repositories/IUserRepository';

export class UserRepositoryMock implements IUserRepository {
  private users: Map<Id, User> = new Map();
  private emailIndex: Map<Email, User> = new Map();

  async findById(id: Id): Promise<User | null> {
    return this.users.get(id) || null;
  }

  async findAll(): Promise<User[]> {
    return Array.from(this.users.values());
  }

  async add(entity: User): Promise<User> {
    if (this.users.has(entity.id)) {
      throw new Error(`User with id ${entity.id} already exists`);
    }

    this.users.set(entity.id, entity);
    this.emailIndex.set(entity.email, entity);
    return entity;
  }

  async update(entity: User): Promise<User> {
    const existingUser = await this.findById(entity.id);

    if (!existingUser) {
      throw new Error(`User with id ${entity.id} not found`);
    }

    if (existingUser.email !== entity.email) {
      this.emailIndex.delete(existingUser.email);
      this.emailIndex.set(entity.email, entity);
    }

    this.users.set(entity.id, entity);
    return entity;
  }

  async remove(id: Id): Promise<void> {
    const user = this.users.get(id);

    if (user) {
      this.emailIndex.delete(user.email);
      this.users.delete(id);
    }
  }

  async findByEmail(email: Email): Promise<User | null> {
    return this.emailIndex.get(email) || null;
  }

  reset(): void {
    this.users.clear();
    this.emailIndex.clear();
  }

  addUserData(user: User): void {
    this.users.set(user.id, user);
    this.emailIndex.set(user.email, user);
  }
}
