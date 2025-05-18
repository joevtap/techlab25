export abstract class BaseMapper<Input, Output> {
  public abstract map(input: Input): Output;

  public mapList(input: Input[]): Output[] {
    return input.map(this.map.bind(this));
  }
}
