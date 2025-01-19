import { Module } from '@nestjs/common';
import { APP_GUARD } from '@nestjs/core';
import { JwtModule } from '@nestjs/jwt';

import { AuthenticationGuard } from '~infra/authentication/guards/authentication.guard';
import { GenerateJWTTokenService } from '~infra/authentication/services/generate.jwt.token.service';
import { EnvModule } from '~infra/env/env.module';
import { EnvService } from '~infra/env/env.service';

@Module({
  imports: [
    EnvModule,
    JwtModule.registerAsync({
      imports: [EnvModule],
      inject: [EnvService],
      global: true,
      useFactory(env: EnvService) {
        const secret = env.get('JWT_SECRET_KEY');
        return {
          secret,
        };
      },
    }),
  ],
  providers: [
    {
      provide: APP_GUARD,
      useClass: AuthenticationGuard,
    },
    AuthenticationGuard,
    GenerateJWTTokenService,
  ],
  exports: [EnvModule, GenerateJWTTokenService],
})
export class AuthenticationModule {}
