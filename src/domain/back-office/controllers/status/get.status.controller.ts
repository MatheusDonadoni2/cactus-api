import {
  BadRequestException,
  Controller,
  Get,
  InternalServerErrorException,
  UseGuards,
} from '@nestjs/common';
import { GetStatusService } from 'src/domain/back-office/services/status/get.status.service';
import { Presenter } from './get.status.controller.presenter';
import { InternalServerError } from 'src/core/error/custom-errors-class/internal-server-error';
import { AuthenticationGuard } from 'src/infra/authentication/guards/authentication.guard';

@Controller('v1/status')
export class GetStatusController {
  constructor(private readonly getStatusService: GetStatusService) {}

  @UseGuards(AuthenticationGuard)
  @Get()
  async handle() {
    const result = await this.getStatusService.execute();

    if (result.isLeft()) {
      const error = result.value;

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
