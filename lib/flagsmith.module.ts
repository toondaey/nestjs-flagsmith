import * as flagsmith from 'flagsmith-nodejs';
import { DynamicModule, Module, Provider } from '@nestjs/common';

import {
  FLAGSMITH_OPTIONS_TOKEN,
  FLAGSMITH_INSTANCE_TOKEN,
} from './flagsmith.constant';
import {
  IFlagsmithOptions,
  IFlagsmithUseFactoryAsyncOptions,
  IFlagsmithOptionsFactory,
  IFlagsmithUseClassAsyncOptions,
  IFlagsmithUseExistingAsyncOptions,
} from './interfaces/flagsmith.interface';
import { FlagsmithService } from './flagsmith.service';

@Module({
  exports: [FlagsmithService],
  providers: [FlagsmithService],
})
export class FlagsmithModule {
  static register(options: IFlagsmithOptions): DynamicModule {
    this.initialize(options);

    return {
      module: FlagsmithModule,
      providers: [
        {
          provide: FLAGSMITH_INSTANCE_TOKEN,
          useValue: flagsmith,
        },
      ],
    };
  }

  static registerAsync(
    options:
      | IFlagsmithUseFactoryAsyncOptions
      | IFlagsmithUseClassAsyncOptions
      | IFlagsmithUseExistingAsyncOptions,
  ): DynamicModule {
    return {
      module: FlagsmithModule,
      providers: [
        ...this.createAsyncProviders(options),
        {
          provide: FLAGSMITH_INSTANCE_TOKEN,
          useFactory: (
            flagsmithOptions: IFlagsmithOptions,
          ): typeof flagsmith => {
            this.initialize(flagsmithOptions);
            return flagsmith;
          },
          inject: [FLAGSMITH_OPTIONS_TOKEN],
        },
      ],
      imports: options.imports || [],
    };
  }

  private static createAsyncProviders(
    options:
      | IFlagsmithUseFactoryAsyncOptions
      | IFlagsmithUseClassAsyncOptions
      | IFlagsmithUseExistingAsyncOptions,
  ): Provider[] {
    if (
      (options as IFlagsmithUseExistingAsyncOptions).useExisting ||
      (options as IFlagsmithUseFactoryAsyncOptions).useFactory
    ) {
      return [this.createAsyncOptionsProvider(options)];
    }

    const { useClass } = options as IFlagsmithUseClassAsyncOptions;

    return [
      this.createAsyncOptionsProvider(options),
      { provide: useClass, useClass },
    ];
  }

  private static createAsyncOptionsProvider(
    options:
      | IFlagsmithUseFactoryAsyncOptions
      | IFlagsmithUseClassAsyncOptions
      | IFlagsmithUseExistingAsyncOptions,
  ): Provider {
    if ((options as IFlagsmithUseFactoryAsyncOptions).useFactory) {
      return {
        provide: FLAGSMITH_OPTIONS_TOKEN,
        useFactory: (options as IFlagsmithUseFactoryAsyncOptions).useFactory,
        inject: options.inject || [],
      };
    }

    const inject = (options.inject || []).concat([
      (options as IFlagsmithUseClassAsyncOptions).useClass ||
        (options as IFlagsmithUseExistingAsyncOptions).useExisting,
    ]);

    return {
      provide: FLAGSMITH_INSTANCE_TOKEN,
      useFactory: (factory: IFlagsmithOptionsFactory) =>
        factory.createFlagsmithOptions(),
      inject,
    };
  }

  private static initialize(options: IFlagsmithOptions): void {
    flagsmith.init(options);
  }
}
