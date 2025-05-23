import { ITokenService } from '../../services/ITokenService';

export class TokenServiceMock implements ITokenService {
  private static DEFAULT_TOKEN = 'test-token';
  private token: string = TokenServiceMock.DEFAULT_TOKEN;
  private payloads: Record<string, Record<string, unknown>> = {};

  async generateToken(payload: Record<string, unknown>): Promise<string> {
    this.payloads[this.token] = payload;
    return this.token;
  }

  async verifyToken(token: string): Promise<Record<string, unknown>> {
    const payload = this.payloads[token];
    if (!payload) {
      throw new Error('Invalid token');
    }
    return payload;
  }

  setToken(token: string): void {
    this.token = token;
  }

  reset(): void {
    this.token = TokenServiceMock.DEFAULT_TOKEN;
    this.payloads = {};
  }
}
