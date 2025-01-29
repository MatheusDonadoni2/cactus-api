import { Module } from '@nestjs/common';

import { BackOfficeModule } from '~/domain/back-office/services/backOffice.service.module';
import { CreatePersonController } from '~backOffice/controllers/person/create.person.controller';
import { GetStatusController } from '~backOffice/controllers/status/get.status.controller';
import { AuthenticateUserController } from '~backOffice/controllers/user/authenticate.user.controller';

import { AuthenticationModule } from '../authentication/authentication.module';

@Module({
  imports: [BackOfficeModule, AuthenticationModule],
  controllers: [
    AuthenticateUserController,
    GetStatusController,
    CreatePersonController,
    CreatePersonController,
  ],
})
export class ControllerModule {}
