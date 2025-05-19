// filepath: /home/jovi/www/techlab25/packages/backend/src/modules/auth/application/use-cases/mocks/MockTokenService.ts

import { ITokenService } from '../../../domain/services/ITokenService';

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

  // Helper method for tests to set a specific token
  setMockToken(token: string): void {
    this.mockToken = token;
  }
}
