import { inject, injectable } from 'inversify';
import { Request, Response, NextFunction, Router } from 'express';
import { z } from 'zod';
import { CreateUserUseCase } from '../../../application/use-cases/CreateUserUseCase';
import { errorHandler } from '../../middleware/error';
import { SignUserInUseCase } from '../../../application/use-cases/SignUserInUseCase/SignUserInUseCase';
import { authenticate } from '../../middleware/authenticate';

const createUserSchema = z.object({
  email: z.string().email(),
  password: z.string().min(8),
  username: z.string().min(3),
});

const signInSchema = z.object({
  email: z.string().email(),
  password: z.string().min(8),
});

@injectable()
export class AuthController {
  public readonly router: Router;

  public constructor(
    @inject(Symbol.for('CreateUserUseCase'))
    private readonly createUserUseCase: CreateUserUseCase,

    @inject(Symbol.for('SignUserInUseCase'))
    private readonly signUserInUseCase: SignUserInUseCase,
  ) {
    this.router = Router();
    this.bindRoutes();
    this.router.use(errorHandler);
  }

  private bindRoutes() {
    this.router.post('/sign-up', this.signUp.bind(this));
    this.router.post('/sign-in', this.signIn.bind(this));

    this.router.get('/me', authenticate, this.getUserProfile.bind(this));
  }

  public async signUp(
    req: Request,
    res: Response,
    next: NextFunction,
  ): Promise<void> {
    try {
      const validatedData = createUserSchema.parse(req.body);

      const result = await this.createUserUseCase.execute({
        email: validatedData.email,
        password: validatedData.password,
        username: validatedData.username,
      });

      if (result.isFailure) {
        next(result.getError());
        return;
      }

      const user = result.getValue();

      res.status(201).json({
        id: user.userId,
      });
      return;
    } catch (error) {
      next(error);
    }
  }

  public async signIn(
    req: Request,
    res: Response,
    next: NextFunction,
  ): Promise<void> {
    try {
      const validatedData = signInSchema.parse(req.body);

      const result = await this.signUserInUseCase.execute(validatedData);

      if (result.isFailure) {
        next(result.getError());
        return;
      }

      const token = result.getValue();

      res.status(200).json({
        token,
      });
      return;
    } catch (error) {
      next(error);
    }
  }

  public async getUserProfile(
    req: Request,
    res: Response,
    next: NextFunction,
  ): Promise<void> {
    try {
      res.status(200).json({
        user: req.user,
      });
    } catch (error) {
      next(error);
    }
  }
}
