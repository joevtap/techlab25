import { User } from '@auth/domain/entities/User';
import { IUserRepository } from '@auth/repositories/IUserRepository';
import { Id } from '@core/domain/value-objects';
import { Repository } from 'typeorm';
import { UserEntity } from '../orm/entities';
import { inject, injectable } from 'inversify';
import { TypeOrmToDomainUserMapper } from '@auth/mappers/user/TypeOrmToDomainUserMapper';

@injectable()
export class TypeOrmUserRepository implements IUserRepository {
  public constructor(
    @inject(Symbol.for('TypeOrmUserEntityRepository'))
    private readonly repo: Repository<UserEntity>,
    @inject(Symbol.for('TypeOrmToDomainUserMapper'))
    private readonly typeOrmToDomainUserMapper: TypeOrmToDomainUserMapper,
  ) {}

  public async findById(id: Id): Promise<User | null> {
    const user = await this.repo.findOneBy({ id });

    if (user) {
      return this.typeOrmToDomainUserMapper.map(user);
    }

    return null;
  }

  public async save(user: User): Promise<void> {
    const userEntity = this.repo.create({
      id: user.id,
      email: user.email.toString(),
      username: user.username.toString(),
      passwordHash: user.passwordHash,
    });

    await this.repo.save(userEntity);
  }
}
