import { Module } from '@nestjs/common';
import { PGService } from './pg/pg.service';
import { PGStatusRepository } from './pg/repositories/pg-status-repository';
import { EnvModule } from '../env/env.module';

@Module({
  imports: [EnvModule],
  providers: [PGService, PGStatusRepository],
  exports: [PGStatusRepository],
})
export class DatabaseModule {}
