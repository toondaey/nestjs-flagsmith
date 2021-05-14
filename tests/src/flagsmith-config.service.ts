import * as faker from 'faker';
import { Injectable } from '@nestjs/common';

import {
  IFlagsmithOptions,
  IFlagsmithOptionsFactory,
} from '../../lib/interfaces/flagsmith.interface';

@Injectable()
export class FlagsmithConfigService
  implements IFlagsmithOptionsFactory
{
  createFlagsmithOptions(): IFlagsmithOptions {
    return { environmentID: faker.datatype.string() };
  }
}
