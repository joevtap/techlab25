import { Repository } from 'typeorm';
import { UserEntity } from '../orm/entities';
import { inject, injectable } from 'inversify';
import { IUserRepository } from '../../domain/repositories/IUserRepository';
import { Id, Email } from '../../../../core/domain/value-objects';
import { User } from '../../domain/entities/User';
import { TypeOrmUserMapper } from '../mappers/user/TypeOrmUserMapper';

@injectable()
export class TypeOrmUserRepository implements IUserRepository {
  public constructor(
    @inject(Symbol.for('TypeOrmUserEntityRepository'))
    private readonly repo: Repository<UserEntity>,
  ) {}

  public async findById(id: Id): Promise<User | null> {
    const user = await this.repo.findOneBy({ id: id.toString() });

    if (user) {
      return TypeOrmUserMapper.toDomain(user);
    }

    return null;
  }

  public async findByEmail(email: Email): Promise<User | null> {
    const user = await this.repo.findOneBy({ email: email.toString() });

    if (user) {
      return TypeOrmUserMapper.toDomain(user);
    }

    return null;
  }

  public async save(user: User): Promise<void> {
    const userEntity = this.repo.create(TypeOrmUserMapper.toTypeOrm(user));

    await this.repo.save(userEntity);
  }
}
