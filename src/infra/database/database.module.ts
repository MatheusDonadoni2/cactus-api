import { Module } from '@nestjs/common';
import { EnvModule } from '@infra/env/env.module';
import { PGService } from '@infra/database/pg/pg.service';

import { PGStatusRepository } from '@infra/database/pg/repositories/pg-status-repository';
import { PersonRepository } from '@infra/database/pg/repositories/person-repository';
import { UserRepository } from '@infra/database/pg/repositories/user.repository';

@Module({
  imports: [EnvModule],
  providers: [PGService, PGStatusRepository, PersonRepository, UserRepository],
  exports: [PGService, PGStatusRepository, PersonRepository, UserRepository],
})
export class DatabaseModule {}
