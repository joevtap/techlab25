import { Router } from 'express';
import { Container } from 'inversify';

export interface IModule {
  register(container: Container): void;
  routers(
    container: Container,
  ): Array<{ path: string; router: Router; authRequired?: boolean }>;
}

export abstract class Module implements IModule {
  public abstract readonly name: string;

  abstract register(container: Container): void;
  abstract routers(
    container: Container,
  ): Array<{ path: string; router: Router; authRequired?: boolean }>;
}
