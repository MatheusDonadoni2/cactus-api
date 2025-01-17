import { Module } from '@nestjs/common';
import { EnvModule } from '../env/env.module';
import { PGService } from './pg/pg.service';

import { PGStatusRepository } from './pg/repositories/pg-status-repository';
import { PersonRepository } from './pg/repositories/person-repository';
import { UserRepository } from './pg/repositories/user.repository';

@Module({
  imports: [EnvModule],
  providers: [PGService, PGStatusRepository, PersonRepository, UserRepository],
  exports: [PGService, PGStatusRepository, PersonRepository, UserRepository],
})
export class DatabaseModule {}
