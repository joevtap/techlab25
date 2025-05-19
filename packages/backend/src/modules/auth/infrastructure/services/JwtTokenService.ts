import { injectable } from 'inversify';
import { jwtVerify, SignJWT } from 'jose';
import { ITokenService } from '../../domain/services/ITokenService';

@injectable()
export class JwtTokenService implements ITokenService {
  private readonly JWT_SECRET = process.env.JWT_SECRET || 'super-secret';
  private readonly TOKEN_EXPIRATION = process.env.TOKEN_EXPIRATION || '1h';

  async generateToken(payload: Record<string, unknown>): Promise<string> {
    const secret = new TextEncoder().encode(this.JWT_SECRET);

    const jwt = await new SignJWT(payload)
      .setProtectedHeader({
        alg: 'HS256',
      })
      .setIssuedAt()
      .setIssuer('techlab25')
      .setAudience('techlab25')
      .setExpirationTime(this.TOKEN_EXPIRATION)
      .sign(secret);

    return jwt;
  }

  async verifyToken(token: string): Promise<Record<string, unknown>> {
    const secret = new TextEncoder().encode(this.JWT_SECRET);

    const { payload } = await jwtVerify(token, secret, {
      algorithms: ['HS256'],
      issuer: 'techlab25',
      audience: 'techlab25',
    });

    return payload;
  }
}
