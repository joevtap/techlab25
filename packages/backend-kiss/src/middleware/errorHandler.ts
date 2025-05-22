import { Request, Response, NextFunction } from 'express';
import { ZodError } from 'zod';

import { BusinessRuleViolationError } from '../errors/BusinessRuleViolationError';
import { DomainError } from '../errors/DomainError';
import { InvalidCredentialsError } from '../errors/InvalidCredentialsError';
import { NotFoundError } from '../errors/NotFoundError';
import { UserAlreadyExistsError } from '../errors/UserAlreadyExistsError';
import { ValidationError } from '../errors/ValidationError';

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
      type: 'Error',
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
