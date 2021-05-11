import { init } from 'flagsmith-nodejs';
import { ModuleMetadata, Type } from '@nestjs/common';

export type IFlagsmithOptions = Parameters<typeof init>[0];

export interface IFlagsmithOptionsFactory {
  createFlagsmithOptions(): IFlagsmithOptions;
}

export interface IFlagsmithAsyncOptions
  extends Pick<ModuleMetadata, 'imports'> {
  useFactory: () => IFlagsmithOptions;
  useClass: Type<IFlagsmithOptionsFactory>;
  useExisting: Type<IFlagsmithOptionsFactory>;
  inject: Array<any>;
}
