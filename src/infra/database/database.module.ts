import { Module } from '@nestjs/common';
import { PGService } from './pg/pg.service';
import { PGStatusRepository } from './pg/repositories/pg-status-repository';

@Module({
  providers: [PGService, PGStatusRepository],
  exports: [PGStatusRepository],
})
export class DatabaseModule {}
