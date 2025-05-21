import { Request, Response, NextFunction } from 'express';
import { ZodError } from 'zod';

import { InvalidCredentialsError } from '../../../modules/auth/domain/errors';
import { UserAlreadyExistsError } from '../../../modules/auth/domain/errors/UserAlreadyExistsError';
import {
  ValidationError,
  NotFoundError,
  BusinessRuleViolationError,
  DomainError,
} from '../../domain/errors';

export function errorHandler(
  err: Error,
  req: Request,
  res: Response,
  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  next: NextFunction,
) {
  if (err instanceof ValidationError) {
    res.status(400).json({
      type: 'ValidationError',
      message: err.message,
    });
    return;
  }

  if (err instanceof InvalidCredentialsError) {
    res.status(401).json({
      type: 'InvalidCredentialsError',
      message: err.message,
    });
    return;
  }

  if (err instanceof UserAlreadyExistsError) {
    res.status(409).json({
      type: 'UserAlreadyExistsError',
      message: err.message,
    });
    return;
  }

  if (err instanceof BusinessRuleViolationError) {
    res.status(422).json({
      type: 'BusinessRuleViolationError',
      message: err.message,
    });
    return;
  }

  if (err instanceof NotFoundError) {
    res.status(404).json({
      type: 'NotFoundError',
      message: err.message,
    });
    return;
  }

  if (err instanceof DomainError) {
    res.status(400).json({
      type: 'DomainError',
      message: err.message,
    });
    return;
  }

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
