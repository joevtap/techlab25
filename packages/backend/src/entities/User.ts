import { BaseEntity } from './Base';
import { Email, Password, Id, Username } from './types';

export class User extends BaseEntity {
  public constructor(
    public readonly id: Id,
    public readonly email: Email,
    public readonly username: Username,
    public readonly password: Password,
  ) {
    super(id);
  }
}
