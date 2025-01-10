import { Module } from '@nestjs/common';
import { ControllerModule } from './infra/http/controller.module';
import { ConfigModule } from '@nestjs/config';
@Module({
  imports: [
    ConfigModule.forRoot({
      envFilePath: '.env.development',
    }),
    ControllerModule,
  ],
})
export class AppModule {}
