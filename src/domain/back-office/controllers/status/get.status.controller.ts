import {
  Controller,
  Get,
  InternalServerErrorException,
  UseGuards,
} from '@nestjs/common';

import { Presenter } from '~/domain/back-office/controllers/status/get.status..presenter';
import { GetStatusService } from '~backOffice/services/status/get.status.service';
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
        default:
          throw new InternalServerErrorException();
      }
    }

    const { status } = result.value;

    return {
      data: Presenter.getStatus(status),
    };
  }
}
