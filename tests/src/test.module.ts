import * as faker from 'faker';
import { DynamicModule, Module } from '@nestjs/common';

import { FlagsmithModule } from '../../lib';
import { FlagsmithConfigService } from './flagsmith-config.service';

@Module({})
export class TestModule {
  static withRegister(): DynamicModule {
    return {
      module: TestModule,
      imports: [
        FlagsmithModule.register({
          environmentID: faker.datatype.string(),
        }),
      ],
    };
  }

  static withUseFactory(): DynamicModule {
    return {
      module: TestModule,
      imports: [
        FlagsmithModule.registerAsync({
          // useFactory: () => ({ environmentID: '' })
          useClass: FlagsmithConfigService,
        }),
      ],
    };
  }
}
