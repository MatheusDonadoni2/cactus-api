import { Module } from '@nestjs/common';
import { JwtModule } from '@nestjs/jwt';

import { AuthenticationGuard } from './guards/authentication.guard';

import { AuthenticateUserService } from 'src/domain/back-office/services/user/services/authenticate.user.service';
import { ValidateUserAccessServices } from 'src/domain/back-office/services/user/services/validate.user.access.service';

import { GenerateJWTTokenService } from './services/generate.jwt.token.service';

@Module({
  providers: [
    AuthenticationGuard,
    GenerateJWTTokenService,
    ValidateUserAccessServices,
    AuthenticateUserService,
  ],
  imports: [JwtModule.register({ global: true, secret: 'MY_SECRET_KEY' })],
  exports: [AuthenticateUserService, GenerateJWTTokenService],
})
export class AuthenticationModule {}
