import { inject, injectable } from 'inversify';
import { Request, Response, NextFunction } from 'express';
import { z } from 'zod';
import { CreateUserUseCase } from '../../../application/use-cases/CreateUserUseCase';

const createUserSchema = z.object({
  email: z.string().email(),
  password: z.string().min(8),
  username: z.string().min(3),
});

@injectable()
export class UserController {
  public constructor(
    @inject(Symbol.for('CreateUserUseCase'))
    private readonly createUserUseCase: CreateUserUseCase,
  ) {}

  public async SignUp(
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

      if (result.isSuccess) {
        const user = result.getValue();

        res.status(201).json({
          id: user.userId,
        });
      } else {
        next(result.getError());
      }
    } catch (error) {
      next(error);
    }
  }
}
