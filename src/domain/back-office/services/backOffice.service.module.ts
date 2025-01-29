import { Module } from '@nestjs/common';

import { AuthenticationModule } from '~/infra/authentication/authentication.module';
import { CryptographyModule } from '~/infra/cryptography/cryptography.module';
import { DatabaseModule } from '~/infra/database/database.module';
import { CreateLegalPersonService } from '~backOffice/services/legalPerson/create.legal.person.service';
import { GetLegalPersonByCNPJService } from '~backOffice/services/legalPerson/get.legal.person.by.cnpj.service';
import { CreateNaturalPersonService } from '~backOffice/services/naturalPerson/create.natural.person.service';
import { GetNaturalPersonByCPFService } from '~backOffice/services/naturalPerson/get.natural.person.by.cpf.service';
import { CreatePersonService } from '~backOffice/services/person/create.person.service';
import { GetPersonByIdService } from '~backOffice/services/person/get.person.by.id.service';
import { GetStatusService } from '~backOffice/services/status/get.status.service';
import { AuthenticateUserService } from '~backOffice/services/user/services/authenticate.user.service';
import { GetUserServiceByUserNameService } from '~backOffice/services/user/services/get.user.by.username.service';

@Module({
  imports: [DatabaseModule, AuthenticationModule, CryptographyModule],
  providers: [
    AuthenticateUserService,
    GetStatusService,
    GetUserServiceByUserNameService,
    CreatePersonService,
    GetPersonByIdService,
    CreateLegalPersonService,
    CreateNaturalPersonService,
    GetLegalPersonByCNPJService,
    GetNaturalPersonByCPFService,
  ],
  exports: [
    AuthenticateUserService,
    GetStatusService,
    GetUserServiceByUserNameService,
    CreatePersonService,
    GetPersonByIdService,
    CreateLegalPersonService,
    CreateNaturalPersonService,
    GetLegalPersonByCNPJService,
    GetNaturalPersonByCPFService,
  ],
})
export class BackOfficeModule {}
