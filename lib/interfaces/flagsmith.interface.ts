import { init } from 'flagsmith-nodejs';
import { ModuleMetadata, Type } from '@nestjs/common';

export type IFlagsmithOptions = Parameters<typeof init>[0];

export interface IFlagsmithOptionsFactory {
  createFlagsmithOptions(): IFlagsmithOptions;
}

export interface IFlagsmithAsyncAbstractOptions
  extends Pick<ModuleMetadata, 'imports'> {
  inject?: Array<any>;
}

export interface IFlagsmithUseFactoryAsyncOptions
  extends IFlagsmithAsyncAbstractOptions {
  useFactory: () => IFlagsmithOptions;
}

export interface IFlagsmithUseClassAsyncOptions
  extends IFlagsmithAsyncAbstractOptions {
  useClass: Type<IFlagsmithOptionsFactory>;
}

export interface IFlagsmithUseExistingAsyncOptions
  extends IFlagsmithAsyncAbstractOptions {
  useExisting: Type<IFlagsmithOptionsFactory>;
}

export type IFlagsmithAsyncOptions =
  | IFlagsmithUseFactoryAsyncOptions
  | IFlagsmithUseClassAsyncOptions
  | IFlagsmithUseExistingAsyncOptions;
