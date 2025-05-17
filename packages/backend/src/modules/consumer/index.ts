import { inject, injectable } from "inversify";

interface IProducer {
  hello: (name: string) => string;
}

@injectable()
export class Consumer {
  constructor(
    @inject(Symbol.for("producer")) private readonly producer: IProducer
  ) {}

  public consume(name: string) {
    console.log(this.producer.hello(name));
  }
}
