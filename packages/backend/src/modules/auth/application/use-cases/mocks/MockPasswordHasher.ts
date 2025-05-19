import { IPasswordHasher } from '../../../domain/services/IPasswordHasher';

export class MockPasswordHasher implements IPasswordHasher {
  private verifyResult: boolean = true;

  async hash(plaintext: string): Promise<string> {
    return `hashed_${plaintext}`;
  }

  async verify(): Promise<boolean> {
    return this.verifyResult;
  }

  setVerifyResult(result: boolean): void {
    this.verifyResult = result;
  }
}
