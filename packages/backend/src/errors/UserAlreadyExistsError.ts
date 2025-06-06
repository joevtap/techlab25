import { DomainError } from './DomainError';

export class UserAlreadyExistsError extends DomainError {
  constructor(email: string) {
    super(`User Already Exists Error: User with email ${email} already exists`);
  }
}
