import { DomainError } from './DomainError';

export class InvalidCredentialsError extends DomainError {
  constructor() {
    super('Invalid Credentials Error: Invalid email or password');
  }
}
