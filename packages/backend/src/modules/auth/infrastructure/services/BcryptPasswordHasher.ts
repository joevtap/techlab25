import { IPasswordHasher } from '../../domain/services/IPasswordHasher';
import * as bcrypt from 'bcrypt';
import { injectable } from 'inversify';

@injectable()
export class BcryptPasswordHasher implements IPasswordHasher {
  private readonly SALT_ROUNDS = 10;

  async hash(plaintext: string): Promise<string> {
    return bcrypt.hash(plaintext, this.SALT_ROUNDS);
  }

  async verify(plaintext: string, hashed: string): Promise<boolean> {
    return bcrypt.compare(plaintext, hashed);
  }
}
