import { Id } from './types';

export abstract class BaseEntity {
  protected constructor(public readonly id: Id) {}
}
