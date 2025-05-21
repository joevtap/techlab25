import { Request, Response, NextFunction } from 'express';

import { IoC } from '../infrastructure/IoC';
import { TOKENS } from '../infrastructure/Tokens';
import { ITokenService } from '../services/ITokenService';

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
    const tokenService = IoC.container.get<ITokenService>(TOKENS.TOKEN_SERVICE);

    try {
      const payload = await tokenService.verifyToken(token);
      req.user = payload;
      next();
    } catch {
      res.status(401).json({
        type: 'AuthenticationError',
        message: 'Invalid token',
      });
      return;
    }
  } catch (error) {
    next(error);
  }
};
