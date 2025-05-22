import { inject, injectable } from 'inversify';

import {
  CreateUserRequest,
  CreateUserResponse,
  SignUserInRequest,
  SignUserInResponse,
} from '../dtos';
import { Token } from '../entities/types';
import { User } from '../entities/User';
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
    @inject(TOKENS.UOW) private readonly uow: IUnitOfWork,
    @inject(TOKENS.ID_GENERATOR) private readonly idGenerator: IIdGenerator,
    @inject(TOKENS.TOKEN_SERVICE) private readonly tokenService: ITokenService,
    @inject(TOKENS.PASSWORD_HASHER)
    private readonly passwordHasher: IPasswordHasher,
  ) {}

  public async createUser(
    user: CreateUserRequest,
  ): Promise<CreateUserResponse> {
    return this.executeWithTransaction(async () => {
      await this.validateEmailNotInUse(user.email);

      const userId = this.idGenerator.generate();
      const hashedPassword = await this.passwordHasher.hash(user.password);

      const newUser = new User(
        userId,
        user.email,
        user.username,
        hashedPassword,
      );

      await this.uow.userRepository.add(newUser);

      return { id: userId, email: user.email, username: user.username };
    });
  }

  public async signUserIn(
    user: SignUserInRequest,
  ): Promise<SignUserInResponse> {
    return await this.executeWithTransaction(async () => {
      const existingUser = await this.findUserByEmailOrFail(user.email);
      await this.validatePassword(user.password, existingUser.password);

      const token: Token = await this.tokenService.generateToken({
        id: existingUser.id,
        email: existingUser.email,
        username: existingUser.username,
      });

      return { token };
    });
  }

  private async executeWithTransaction<T>(
    operation: () => Promise<T>,
  ): Promise<T> {
    try {
      await this.uow.start();
      const result = await operation();
      await this.uow.commit();
      return result;
    } catch (error) {
      await this.uow.rollback();
      throw error;
    }
  }

  private async validateEmailNotInUse(email: string): Promise<void> {
    const userExists = await this.uow.userRepository.findByEmail(email);
    if (userExists) {
      throw new UserAlreadyExistsError(email);
    }
  }

  private async findUserByEmailOrFail(email: string): Promise<User> {
    const existingUser = await this.uow.userRepository.findByEmail(email);
    if (!existingUser) {
      throw new InvalidCredentialsError();
    }
    return existingUser;
  }

  private async validatePassword(
    providedPassword: string,
    storedPassword: string,
  ): Promise<void> {
    const passwordIsValid = await this.passwordHasher.verify(
      providedPassword,
      storedPassword,
    );

    if (!passwordIsValid) {
      throw new InvalidCredentialsError();
    }
  }
}
