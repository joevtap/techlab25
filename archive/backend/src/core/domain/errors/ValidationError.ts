import { DomainError } from './DomainError';

export class ValidationError extends DomainError {
  constructor(message: string) {
    super(`Validation Error: ${message}`);
  }
}
