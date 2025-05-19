import { Request, Response, NextFunction } from 'express';
import {
  ValidationError,
  NotFoundError,
  BusinessRuleViolationError,
  DomainError,
} from '@core/domain/errors';
import { ZodError } from 'zod';

export function errorHandler(
  err: Error,
  req: Request,
  res: Response,
  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  next: NextFunction,
) {
  console.error(`Error processing request: ${err.message}`, err);

  if (err instanceof ValidationError) {
    return res.status(400).json({
      type: 'ValidationError',
      message: err.message,
    });
  }

  if (err instanceof BusinessRuleViolationError) {
    return res.status(422).json({
      type: 'BusinessRuleViolationError',
      message: err.message,
    });
  }

  if (err instanceof NotFoundError) {
    return res.status(404).json({
      type: 'NotFoundError',
      message: err.message,
    });
  }

  if (err instanceof DomainError) {
    return res.status(400).json({
      type: 'DomainError',
      message: err.message,
    });
  }

  if (err instanceof ZodError) {
    return res.status(400).json({
      type: 'ValidationError',
      message: 'Validation error',
      details: err.errors,
    });
  }

  return res.status(500).json({
    type: 'ServerError',
    message: 'An unexpected error occurred',
  });
}
