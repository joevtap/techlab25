import { User } from '@auth/domain/entities/User';
import { HashedPassword } from '@auth/domain/value-objects';
import { UserEntity } from '@auth/infrastructure/orm/entities';
import { Email, Id, Username } from '@core/domain/value-objects';

export class TypeOrmUserMapper {
  public static toDomain(input: UserEntity): User {
    return User.create({
      id: new Id(input.id),
      email: new Email(input.email),
      username: new Username(input.username),
      hashedPassword: new HashedPassword(input.hashedPassword),
    });
  }

  public static toTypeOrm(input: User): UserEntity {
    return {
      id: input.id.toString(),
      email: input.email.toString(),
      username: input.username.toString(),
      hashedPassword: input.hashedPassword.toString(),
    };
  }
}
