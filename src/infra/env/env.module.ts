import { Module } from '@nestjs/common';
import { EnvService } from './env.service';
import { ConfigService } from '@nestjs/config';

@Module({
  providers: [ConfigService, EnvService],
  exports: [ConfigService, EnvService],
})
export class EnvModule {}
