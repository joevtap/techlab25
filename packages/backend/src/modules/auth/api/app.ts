import { Router } from 'express';
import { errorHandler } from './middleware/error';
import { container } from '../../../di';
import { UserController } from './controllers/User';

export function createAuthModule() {
  const auth = Router();

  const userController = container.get<UserController>(
    Symbol.for('UserController'),
  );

  auth.route('/auth/sign-up').post((...args) => {
    return userController.SignUp(...args);
  });

  auth.use(errorHandler);

  return auth;
}
