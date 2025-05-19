import { Container } from 'inversify';
import { Module } from '../../core/application/Module';

export class AccountModule extends Module {
  public readonly name = 'account';

  public register(container: Container) {}

  public routers(container: Container) {
    return [];
  }
}
