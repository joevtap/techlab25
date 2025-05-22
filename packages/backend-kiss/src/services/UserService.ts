import { inject, injectable } from 'inversify';

import { Token } from '../entities/types';
import { User } from '../entities/User';
import { AuthenticationError } from '../errors/AuthenticationError';
import { InvalidCredentialsError } from '../errors/InvalidCredentialsError';
import { UserAlreadyExistsError } from '../errors/UserAlreadyExistsError';
import { TOKENS } from '../infrastructure/Tokens';
import { IUnitOfWork } from '../repositories/IUnitOfWork';

import { IIdGenerator } from './IIdGenerator';
import { IPasswordHasher } from './IPasswordHasher';
import { ITokenService } from './ITokenService';

@injectable()
export class UserService {
  public constructor(
    @inject(TOKENS.UOW) private uow: IUnitOfWork,
    @inject(TOKENS.ID_GENERATOR) private idGenerator: IIdGenerator,
    @inject(TOKENS.TOKEN_SERVICE) private tokenService: ITokenService,
    @inject(TOKENS.PASSWORD_HASHER) private passwordHasher: IPasswordHasher,
  ) {}

  public async createUser(user: Omit<User, 'id'>) {
    try {
      await this.uow.start();

      const userExists = await this.uow.userRepository.findByEmail(user.email);

      if (userExists) {
        throw new UserAlreadyExistsError(user.email);
      }

      const userId = this.idGenerator.generate();
      const hashedPassword = await this.passwordHasher.hash(user.password);

      const newUser = new User(
        userId,
        user.email,
        user.username,
        hashedPassword,
      );

      await this.uow.userRepository.add(newUser);

      await this.uow.commit();
    } catch (error) {
      await this.uow.rollback();
      throw error;
    }
  }

  public async signUserIn(user: Omit<User, 'id' | 'username'>): Promise<Token> {
    try {
      await this.uow.start();

      const existingUser = await this.uow.userRepository.findByEmail(
        user.email,
      );

      if (!existingUser) {
        throw new InvalidCredentialsError();
      }

      const passwordIsValid = await this.passwordHasher.verify(
        user.password,
        existingUser.password,
      );

      if (!passwordIsValid) {
        throw new InvalidCredentialsError();
      }

      await this.uow.commit();

      const token: Token = await this.tokenService.generateToken({
        id: existingUser.id,
        email: existingUser.email,
        username: existingUser.username,
      });

      return token;
    } catch (error) {
      await this.uow.rollback();

      throw new AuthenticationError(
        `Authentication failed: ${error instanceof Error ? error.message : String(error)}`,
      );
    }
  }
}
