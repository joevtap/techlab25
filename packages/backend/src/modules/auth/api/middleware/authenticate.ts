import { Request, Response, NextFunction } from 'express';

import { container } from '../../../../di';
import { ITokenService } from '../../domain/services/ITokenService';

export const authenticate = async (
  req: Request,
  res: Response,
  next: NextFunction,
) => {
  try {
    const authHeader = req.headers.authorization;

    if (!authHeader || !authHeader.startsWith('Bearer ')) {
      res.status(401).json({
        type: 'AuthenticationError',
        message: 'Authentication required',
      });
      return;
    }

    const token = authHeader.split(' ')[1];
    const tokenService = container.get<ITokenService>(
      Symbol.for('TokenService'),
    );

    try {
      const payload = await tokenService.verifyToken(token);
      req.user = payload;
      next();
    } catch {
      res.status(401).json({
        type: 'AuthenticationError',
        message: 'Invalid token',
      });
    }
  } catch (error) {
    next(error);
  }
};
