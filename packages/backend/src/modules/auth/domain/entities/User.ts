import { BaseEntity } from '@core/domain/entities/Base';
import { Id } from '@core/domain/value-objects/Id';

export class User extends BaseEntity {
  constructor(id: Id) {
    super(id);
  }
}
