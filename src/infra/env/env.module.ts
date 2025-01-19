import { Module } from '@nestjs/common';
import { EnvService } from '@infra/env/env.service';
import { ConfigService } from '@nestjs/config';

@Module({
  providers: [ConfigService, EnvService],
  exports: [ConfigService, EnvService],
})
export class EnvModule {}
