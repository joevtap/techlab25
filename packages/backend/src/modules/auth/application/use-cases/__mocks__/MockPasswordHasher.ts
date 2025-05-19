import { IPasswordHasher } from '../../../domain/services/IPasswordHasher';

export class MockPasswordHasher implements IPasswordHasher {
  async hash(plaintext: string): Promise<string> {
    return `hashed_${plaintext}`;
  }

  async verify(plaintext: string, hashed: string): Promise<boolean> {
    return hashed === `hashed_${plaintext}`;
  }
}
