import { BusinessRuleViolationError } from '../../../../core/domain/errors';

export class InsufficientFundsError extends BusinessRuleViolationError {
  constructor(message: string) {
    super(`Insufficient Funds Error: ${message}`);
  }
}
