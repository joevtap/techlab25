import { IProducer } from "@techlab25/contracts";
import { inject, injectable } from "inversify";

@injectable()
export class Consumer {
  constructor(
    @inject(Symbol.for("producer")) private readonly producer: IProducer
  ) {}

  public consume(name: string) {
    console.log(this.producer.hello(name));
  }
}
