import { Request, Response, NextFunction } from 'express';
import { z } from 'zod/v4';

export function validate(schema: z.ZodObject) {
  return (req: Request, res: Response, next: NextFunction) => {
    try {
      schema.parse(req.body);
      next();
    } catch (error) {
      next(error);
    }
  };
}
