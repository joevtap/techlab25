import { IIdGenerator } from '@core/domain/services/IIdGenerator';
import { nanoid } from 'nanoid';
import { injectable } from 'inversify';

@injectable()
export class NanoIdGenerator implements IIdGenerator {
  generate(): string {
    return nanoid();
  }
}
