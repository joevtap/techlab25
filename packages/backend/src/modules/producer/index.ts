import { IProducer } from '@techlab25/contracts';
import { injectable } from 'inversify';

@injectable()
export class Producer implements IProducer {
  public hello(name: string): string {
    return `Hello, ${name}!`;
  }
}
