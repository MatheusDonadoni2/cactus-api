import { Module } from '@nestjs/common';

import { PGService } from '~infra/database/pg/pg.service';
import { PersonRepository } from '~infra/database/pg/repositories/person-repository';
import { PGStatusRepository } from '~infra/database/pg/repositories/pg-status-repository';
import { UserRepository } from '~infra/database/pg/repositories/user.repository';
import { EnvModule } from '~infra/env/env.module';

@Module({
  imports: [EnvModule],
  providers: [PGService, PGStatusRepository, PersonRepository, UserRepository],
  exports: [PGService, PGStatusRepository, PersonRepository, UserRepository],
})
export class DatabaseModule {}
