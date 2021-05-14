import * as faker from 'faker';
import { DynamicModule, Module } from '@nestjs/common';

import { FlagsmithModule } from '../../lib';
import { ExistingModule } from './existing.module';
import { FlagsmithConfigService } from './flagsmith-config.service';

@Module({})
export class TestModule {
  static withRegister(api?: string): DynamicModule {
    return {
      module: TestModule,
      imports: [
        FlagsmithModule.register({
          environmentID: faker.datatype.string(),
          api,
        }),
      ],
    };
  }

  static withUseFactory(): DynamicModule {
    return {
      module: TestModule,
      imports: [
        FlagsmithModule.registerAsync({
          useFactory: () => ({
            environmentID: faker.datatype.string(),
          }),
        }),
      ],
    };
  }

  static withUseClass(): DynamicModule {
    return {
      module: TestModule,
      imports: [
        FlagsmithModule.registerAsync({
          useClass: FlagsmithConfigService,
        }),
      ],
    };
  }

  static withUseExisting(): DynamicModule {
    return {
      module: TestModule,
      imports: [
        FlagsmithModule.registerAsync({
          useExisting: FlagsmithConfigService,
          imports: [ExistingModule],
        }),
      ],
    };
  }
}
