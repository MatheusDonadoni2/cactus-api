import { Module } from '@nestjs/common';
import { JwtModule } from '@nestjs/jwt';

import { AuthenticationGuard } from './guards/authentication.guard';

import { GenerateJWTTokenService } from './services/generate.jwt.token.service';
import { APP_GUARD } from '@nestjs/core';
import { EnvModule } from '../env/env.module';
import { EnvService } from '../env/env.service';

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
