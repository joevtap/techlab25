import { BaseEntity } from '@core/domain/entities/Base';
import { Email, Id, Username } from '@core/domain/value-objects';
import { PasswordHash } from '../value-objects';

type UserProps = {
  id: Id;
  username: Username;
  email: Email;
  passwordHash: PasswordHash;
};

export class User extends BaseEntity {
  public readonly username: Username;
  public readonly email: Email;
  public readonly passwordHash: PasswordHash;

  private constructor(props: UserProps) {
    super(props.id);

    this.username = props.username;
    this.email = props.email;
    this.passwordHash = props.passwordHash;
  }

  public static create(props: UserProps): User {
    return new User(props);
  }
}
