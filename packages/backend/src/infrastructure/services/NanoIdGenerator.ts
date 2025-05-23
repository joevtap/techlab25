import { injectable } from 'inversify';
import { nanoid } from 'nanoid';

import { IIdGenerator } from '../../services/IIdGenerator';

@injectable()
export class NanoIdGenerator implements IIdGenerator {
  generate(capSize?: number): string {
    return nanoid(capSize);
  }
}
