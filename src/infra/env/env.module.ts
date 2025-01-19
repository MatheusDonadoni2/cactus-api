import { Module } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';

import { EnvService } from '~infra/env/env.service';

@Module({
  providers: [ConfigService, EnvService],
  exports: [ConfigService, EnvService],
})
export class EnvModule {}
