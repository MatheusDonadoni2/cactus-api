import { Module } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';

import { envSchema } from '~infra/env/env.schema';
import { ControllerModule } from '~infra/http/controller.module';

@Module({
  imports: [
    ConfigModule.forRoot({
      validate: (env) => envSchema.parse(env),
      envFilePath: '.env.development',
    }),
    ControllerModule,
  ],
})
export class AppModule {}
