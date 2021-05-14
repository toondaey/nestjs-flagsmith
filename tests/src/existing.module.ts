import { Module } from '@nestjs/common';

import { FlagsmithConfigService } from './flagsmith-config.service';

@Module({
  providers: [FlagsmithConfigService],
  exports: [FlagsmithConfigService],
})
export class ExistingModule {}
