import { IPasswordHasher } from '../../services/IPasswordHasher';

export class PasswordHasherMock implements IPasswordHasher {
  async hash(plaintext: string): Promise<string> {
    return `hashed_${plaintext}`;
  }

  async verify(plaintext: string, hashed: string): Promise<boolean> {
    return hashed === `hashed_${plaintext}`;
  }
}
