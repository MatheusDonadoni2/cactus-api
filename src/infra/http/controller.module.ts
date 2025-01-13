import { Module } from '@nestjs/common';
import { GetStatusController } from 'src/domain/back-office/controllers/status/get.status.controller';
import { GetStatusService } from 'src/domain/back-office/services/status/get.status.service';
import { DatabaseModule } from '../database/database.module';
import { AuthenticateUserController } from 'src/domain/back-office/controllers/user/authenticate.user.controller';
import { AuthenticateUserService } from 'src/domain/back-office/services/user/services/authenticate.user.service';
import { AuthenticationModule } from '../authentication/authentication.module';
import { CryptographyModule } from '../cryptography/cryptography.module';

@Module({
  imports: [DatabaseModule, AuthenticationModule, CryptographyModule],
  providers: [AuthenticateUserService, GetStatusService],
  controllers: [AuthenticateUserController, GetStatusController],
})
export class ControllerModule {}
