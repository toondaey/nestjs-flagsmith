import { init } from 'flagsmith-nodejs';
import { ModuleMetadata, Type } from '@nestjs/common';

export type IFlagsmithOptions = Parameters<typeof init>[0];

export interface IFlagsmithOptionsFactory {
  createFlagsmithOptions(): IFlagsmithOptions;
}

export interface IFlagsmithAsyncOptions
  extends Pick<ModuleMetadata, 'imports'> {
  inject?: Array<any>;
}

export interface IFlagsmithUseFactoryAsyncOptions
  extends IFlagsmithAsyncOptions {
  useFactory: () => IFlagsmithOptions;
}

export interface IFlagsmithUseClassAsyncOptions extends IFlagsmithAsyncOptions {
  useClass: Type<IFlagsmithOptionsFactory>;
}

export interface IFlagsmithUseExistingAsyncOptions
  extends IFlagsmithAsyncOptions {
  useExisting: Type<IFlagsmithOptionsFactory>;
}
