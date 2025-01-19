import { Module } from '@nestjs/common';

import { CreatePersonController } from '~backOffice/controllers/person/create.person.controller';
import { GetStatusController } from '~backOffice/controllers/status/get.status.controller';
import { AuthenticateUserController } from '~backOffice/controllers/user/authenticate.user.controller';
import { CreatePersonService } from '~backOffice/services/person/create.person.service';
import { GetStatusService } from '~backOffice/services/status/get.status.service';
import { AuthenticateUserService } from '~backOffice/services/user/services/authenticate.user.service';
import { GetUserServiceByUserNameService } from '~backOffice/services/user/services/get.user.service';
import { AuthenticationModule } from '~infra/authentication/authentication.module';
import { CryptographyModule } from '~infra/cryptography/cryptography.module';
import { DatabaseModule } from '~infra/database/database.module';

@Module({
  imports: [DatabaseModule, AuthenticationModule, CryptographyModule],
  providers: [
    AuthenticateUserService,
    GetStatusService,
    CreatePersonService,
    GetUserServiceByUserNameService,
  ],
  controllers: [
    AuthenticateUserController,
    GetStatusController,
    CreatePersonController,
  ],
})
export class ControllerModule {}
