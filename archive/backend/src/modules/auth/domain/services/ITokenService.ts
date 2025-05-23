export interface ITokenService {
  generateToken(payload: Record<string, unknown>): Promise<string>;
  verifyToken(token: string): Promise<Record<string, unknown>>;
}
