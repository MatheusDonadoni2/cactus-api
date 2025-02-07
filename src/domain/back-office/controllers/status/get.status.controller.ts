import {
  BadRequestException,
  Controller,
  Get,
  InternalServerErrorException,
  UseGuards,
} from '@nestjs/common';

import { Presenter } from '~/domain/back-office/controllers/status/get.status..presenter';
import { GetStatusService } from '~backOffice/services/status/get.status.service';
import { InternalServerError } from '~customErrors/internal-server-error';
import { AuthenticationGuard } from '~infra/authentication/guards/authentication.guard';

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
