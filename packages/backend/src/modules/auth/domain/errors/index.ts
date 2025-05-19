import { DomainError } from '../../../../core/domain/errors';

export class InvalidCredentialsError extends DomainError {
  constructor() {
    super('Invalid email or password');
  }
}
