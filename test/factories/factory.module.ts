import { Module } from '@nestjs/common';

import { CryptographyModule } from '~/infra/cryptography/cryptography.module';
import { DatabaseModule } from '~/infra/database/database.module';

import { FactoryLegalPerson } from './factory.legal.person';
import { FactoryNaturalPerson } from './factory.natural.person';
import { FactoryPerson } from './factory.person';
import { FactoryUser } from './factory.user';

@Module({
  imports: [DatabaseModule, CryptographyModule],
  providers: [
    FactoryPerson,
    FactoryNaturalPerson,
    FactoryLegalPerson,
    FactoryUser,
  ],
  exports: [FactoryPerson, FactoryUser],
})
export class FactoryModule {}
