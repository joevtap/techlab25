import { Container } from "inversify";
import { Producer } from "./modules/producer";
import { Consumer } from "./modules/consumer";

const container: Container = new Container();

container.bind(Symbol.for("producer")).to(Producer);
container.bind(Symbol.for("consumer")).to(Consumer);

const consumer = container.get<Consumer>(Symbol.for("consumer"));

export function main() {
  consumer.consume("World");
}
