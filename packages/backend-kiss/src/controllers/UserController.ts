import { Router, Request, Response, NextFunction } from 'express';
import { inject, injectable } from 'inversify';

import { CreateUserSchema, SignUserInSchema } from '../dtos';
import { TOKENS } from '../infrastructure/Tokens';
import { validate } from '../middleware/validate';
import { UserService } from '../services/UserService';

@injectable()
export class UserController {
  private router: Router;

  constructor(@inject(TOKENS.USER_SERVICE) private userService: UserService) {
    this.router = Router();
    this.initializeRoutes();
  }

  public getRouter(): Router {
    return this.router;
  }

  private initializeRoutes(): void {
    this.router.post(
      '/sign-up',
      validate(CreateUserSchema),
      this.signUp.bind(this),
    );
    this.router.post(
      '/sign-in',
      validate(SignUserInSchema),
      this.signIn.bind(this),
    );
  }

  private async signUp(
    req: Request,
    res: Response,
    next: NextFunction,
  ): Promise<void> {
    try {
      const response = await this.userService.createUser(req.body);
      res.status(201).json(response);
    } catch (error) {
      next(error);
    }
  }

  private async signIn(
    req: Request,
    res: Response,
    next: NextFunction,
  ): Promise<void> {
    try {
      const response = await this.userService.signUserIn(req.body);
      res.status(200).json(response);
    } catch (error) {
      next(error);
    }
  }
}
