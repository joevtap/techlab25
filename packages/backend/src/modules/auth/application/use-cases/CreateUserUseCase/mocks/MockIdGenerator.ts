import { IIdGenerator } from '../../../../../../core/domain/services/IIdGenerator';

export class MockIdGenerator implements IIdGenerator {
  private counter = 1;

  generate(): string {
    return `test-id-${this.counter++}`;
  }

  reset(): void {
    this.counter = 1;
  }
}
