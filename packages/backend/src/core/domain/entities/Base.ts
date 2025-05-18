import { Id } from '../value-objects/Id';

export abstract class BaseEntity {
  public readonly id: Id;

  protected constructor(id: Id) {
    this.id = id;
  }
}
