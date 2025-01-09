import { Module } from '@nestjs/common';
import { GetStatusController } from './controllers/status/get.status.controller';
import { GetStatusService } from '../../domain/back-office/services/status/get.status.service';
import { DatabaseModule } from '../database/database.module';

@Module({
  imports: [DatabaseModule],
  providers: [GetStatusService],
  controllers: [GetStatusController],
})
export class ControllerModule {}
