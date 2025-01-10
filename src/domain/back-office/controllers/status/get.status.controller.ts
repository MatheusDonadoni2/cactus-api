import { Controller, Get } from '@nestjs/common';
import { GetStatusService } from '../../../../domain/back-office/services/status/get.status.service';
import {
  Presenter,
  IPresenterGetStatus,
} from './get.status.controller.presenter';
@Controller('v1/status')
export class GetStatusController {
  constructor(private readonly getStatusService: GetStatusService) {}
  @Get()
  async handle(): Promise<IPresenterGetStatus> {
    const status = await this.getStatusService.execute();
    const presenter = Presenter.getStatus(status);
    return presenter;
  }
}
