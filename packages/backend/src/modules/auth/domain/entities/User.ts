import { BaseEntity } from '@core/domain/entities/Base';
import { Email, Id, Username } from '@core/domain/value-objects';
import { HashedPassword } from '../value-objects';

type UserProps = {
  id: Id;
  username: Username;
  email: Email;
  hashedPassword: HashedPassword;
};

export class User extends BaseEntity {
  public readonly username: Username;
  public readonly email: Email;
  public readonly hashedPassword: HashedPassword;

  private constructor(props: UserProps) {
    super(props.id);

    this.username = props.username;
    this.email = props.email;
    this.hashedPassword = props.hashedPassword;
  }

  public static create(props: UserProps): User {
    return new User(props);
  }
}
