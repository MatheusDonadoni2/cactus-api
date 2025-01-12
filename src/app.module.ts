import { Module } from '@nestjs/common';
import { ControllerModule } from './infra/http/controller.module';
import { ConfigModule } from '@nestjs/config';
import { envSchema } from './infra/env/env.schema';
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
