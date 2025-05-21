import { Request, Response, NextFunction } from 'express';
import { ZodError } from 'zod';

export function errorHandler(
  err: Error,
  req: Request,
  res: Response,
  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  next: NextFunction,
) {
  if (err instanceof ZodError) {
    res.status(400).json({
      type: 'ValidationError',
      message: 'Validation error',
      details: err.errors,
    });
    return;
  }

  res.status(500).json({
    type: 'ServerError',
    message: 'An unexpected error occurred',
  });
}
