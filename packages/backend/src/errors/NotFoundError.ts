import { DomainError } from './DomainError';

export class NotFoundError extends DomainError {
  constructor(entity: string, id?: string) {
    const message = id
      ? `${entity} with id ${id} not found`
      : `${entity} not found`;
    super(`Not Found Error: ${message}`);
  }
}
