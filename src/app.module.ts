import { APP_GUARD } from '@nestjs/core';

import { Module } from '@nestjs/common';
import { ControllerModule } from './infra/http/controller.module';
import { ConfigModule } from '@nestjs/config';
import { AuthenticationGuard } from './infra/authentication/guards/authentication.guard';
@Module({
  providers: [
    {
      provide: APP_GUARD,
      useClass: AuthenticationGuard,
    },
  ],
  imports: [
    ConfigModule.forRoot({
      envFilePath: '.env.development',
    }),
    ControllerModule,
  ],
})
export class AppModule {}
