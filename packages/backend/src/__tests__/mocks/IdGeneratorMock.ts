import { IIdGenerator } from '../../services/IIdGenerator';

export class IdGeneratorMock implements IIdGenerator {
  private nextId = 1;
  private customIds: string[] = [];

  public setCustomIds(ids: string[]) {
    this.customIds = [...ids];
  }

  public generate(capSize?: number): string {
    if (this.customIds.length > 0) {
      return this.customIds.shift()!;
    }

    const id = `id-${this.nextId++}`;
    if (capSize && id.length > capSize) {
      return id.substring(0, capSize);
    }

    return id;
  }
}
