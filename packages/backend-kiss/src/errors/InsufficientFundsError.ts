import { BusinessRuleViolationError } from './BusinessRuleViolationError';

export class InsufficientFundsError extends BusinessRuleViolationError {
  constructor(message: string) {
    super(`Insufficient Funds Error: ${message}`);
  }
}
