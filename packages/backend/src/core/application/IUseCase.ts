export interface IUseCase {
  execute(args: unknown): Promise<unknown>;
}
