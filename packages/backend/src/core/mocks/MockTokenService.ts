import { ITokenService } from '../../modules/auth/domain/services/ITokenService';

export class MockTokenService implements ITokenService {
  private mockToken = 'mock.jwt.token';

  async generateToken(): Promise<string> {
    return this.mockToken;
  }

  async verifyToken(token: string): Promise<Record<string, unknown>> {
    if (token !== this.mockToken) {
      throw new Error('Invalid token');
    }

    return { id: 'user-id', email: 'user@example.com', username: 'username' };
  }

  setMockToken(token: string): void {
    this.mockToken = token;
  }
}
