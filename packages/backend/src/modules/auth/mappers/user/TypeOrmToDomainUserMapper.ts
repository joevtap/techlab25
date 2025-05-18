import { User } from '@auth/domain/entities/User';
import { UserEntity } from '@auth/infrastructure/orm/entities';
import { Email, Username } from '@core/domain/value-objects';
import { BaseMapper } from '@core/mappers/BaseMapper';

export class TypeOrmToDomainUserMapper extends BaseMapper<UserEntity, User> {
  map(input: UserEntity): User {
    return User.create({
      id: input.id,
      email: Email.create(input.email),
      username: Username.create(input.username),
      passwordHash: input.passwordHash,
    });
  }
}
