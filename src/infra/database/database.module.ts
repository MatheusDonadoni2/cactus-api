import { Module } from '@nestjs/common';

import { ILegalPersonRepository } from '~/domain/back-office/repositories/legal.person.repository';
import { INaturalPersonRepository } from '~/domain/back-office/repositories/natural.person.repository';
import { IPersonRepository } from '~/domain/back-office/repositories/person.repository';
import { IUserRepository } from '~/domain/back-office/repositories/user.repository';
import { PGPersonRepository } from '~/infra/database/pg/repositories/pg.person.repository';
import { PGStatusRepository } from '~/infra/database/pg/repositories/pg.status.repository';
import { PGUserRepository } from '~/infra/database/pg/repositories/pg.user.repository';
import { PGService } from '~infra/database/pg/pg.service';
import { EnvModule } from '~infra/env/env.module';

import { PGLegalPersonRepository } from './pg/repositories/pg.legal.person.repository';
import { PGNaturalPersonRepository } from './pg/repositories/pg.natural.person.repository';

@Module({
  imports: [EnvModule],
  providers: [
    PGService,
    PGStatusRepository,
    {
      provide: IPersonRepository,
      useClass: PGPersonRepository,
    },
    {
      provide: IUserRepository,
      useClass: PGUserRepository,
    },
    {
      provide: ILegalPersonRepository,
      useClass: PGLegalPersonRepository,
    },
    {
      provide: INaturalPersonRepository,
      useClass: PGNaturalPersonRepository,
    },
  ],
  exports: [
    PGService,
    PGStatusRepository,
    IPersonRepository,
    IUserRepository,
    ILegalPersonRepository,
    INaturalPersonRepository,
  ],
})
export class DatabaseModule {}
