import { DomainError } from './DomainError';

export class BusinessRuleViolationError extends DomainError {
  constructor(message: string) {
    super(`Business Rule Violation: ${message}`);
  }
}
