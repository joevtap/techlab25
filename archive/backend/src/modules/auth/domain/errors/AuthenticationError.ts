import { DomainError } from '../../../../core/domain/errors';

export class AuthenticationError extends DomainError {
  constructor(message: string) {
    super(`Authentication Error: ${message}`);
  }
}
