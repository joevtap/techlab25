import { injectable } from 'inversify';
import { nanoid } from 'nanoid';

import { IIdGenerator } from '../../core/domain/services/IIdGenerator';

@injectable()
export class NanoIdGenerator implements IIdGenerator {
  generate(): string {
    return nanoid();
  }
}
