import { DomainError } from '@core/domain/errors/DomainError';

export class UserAlreadyExistsError extends DomainError {
  constructor(email: string) {
    super(`User with email ${email} already exists`);
  }
}
