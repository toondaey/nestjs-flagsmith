import * as faker from 'faker';

import {
  IFlagsmithOptions,
  IFlagsmithOptionsFactory,
} from '../../lib/interfaces/flagsmith.interface';

export class FlagsmithConfigService implements IFlagsmithOptionsFactory {
  createFlagsmithOptions(): IFlagsmithOptions {
    return { environmentID: faker.datatype.string() };
  }
}
