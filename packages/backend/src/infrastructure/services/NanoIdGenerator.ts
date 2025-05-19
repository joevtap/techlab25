import { nanoid } from 'nanoid';
import { injectable } from 'inversify';
import { IIdGenerator } from '../../core/domain/services/IIdGenerator';

@injectable()
export class NanoIdGenerator implements IIdGenerator {
  generate(): string {
    return nanoid();
  }
}
