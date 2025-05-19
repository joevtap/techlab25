export class Result<T, E extends Error = Error> {
  public isSuccess: boolean;
  public isFailure: boolean;
  private readonly value: T;
  private readonly error: E;

  private constructor(isSuccess: boolean, error?: E, value?: T) {
    if (isSuccess && error) {
      throw new Error(
        'InvalidOperation: A result cannot be successful and contain an error',
      );
    }

    if (!isSuccess && !error) {
      throw new Error(
        'InvalidOperation: A failing result needs to contain an error',
      );
    }

    this.isSuccess = isSuccess;
    this.isFailure = !isSuccess;
    this.error = error as E;
    this.value = value as T;

    Object.freeze(this);
  }

  public static ok<T>(value?: T): Result<T> {
    return new Result<T>(true, undefined, value);
  }

  public static fail<E extends Error>(error: E): Result<never, E> {
    return new Result<never, E>(false, error);
  }

  public getValue(): T {
    if (!this.isSuccess) {
      throw new Error('Cannot get the value of a failed result');
    }
    return this.value;
  }

  public getError(): E {
    if (!this.isFailure) {
      throw new Error('Cannot get the error of a successful result');
    }
    return this.error;
  }
}
