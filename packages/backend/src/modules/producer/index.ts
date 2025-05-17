import { injectable } from "inversify";

interface IProducer {
  hello: (name: string) => string;
}

@injectable()
export class Producer implements IProducer {
  public hello(name: string): string {
    return `Hello, ${name}!`;
  }
}
