import {
  BadRequestException,
  Controller,
  Get,
  InternalServerErrorException,
} from '@nestjs/common';
import { GetStatusService } from 'src/domain/back-office/services/status/get.status.service';
import { Presenter } from './get.status.controller.presenter';
import { InternalServerError } from 'src/core/error/custom-errors-class/internal-server-error';

@Controller('v1/status')
export class GetStatusController {
  constructor(private readonly getStatusService: GetStatusService) {}

  @Get()
  async handle() {
    const result = await this.getStatusService.execute();

    if (result.isLeft()) {
      const error = result.value;

      console.log({ error });

      switch (error.constructor) {
        case InternalServerError:
          throw new InternalServerErrorException();
        default:
          throw new BadRequestException();
      }
    }

    const { status } = result.value;
    return {
      data: Presenter.getStatus(status),
    };
  }
}
