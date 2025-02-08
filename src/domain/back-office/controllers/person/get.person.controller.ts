import {
  Controller,
  Get,
  InternalServerErrorException,
  NotFoundException,
  Param,
} from '@nestjs/common';

import { GetPersonByIdService } from '~backOffice/services/person/get.person.by.id.service';
import { ResourceNotFound } from '~customErrors/resource.not.found';

import { GetPersonPresenter } from './get.person.presenter';

@Controller('v1/persons')
export class GetPersonController {
  constructor(private readonly getPersonById: GetPersonByIdService) {}

  @Get(':id')
  async handle(@Param('id') id: string) {
    const result = await this.getPersonById.execute({
      id,
    });

    if (result.isLeft()) {
      const error = result.value;
      switch (error.constructor) {
        case ResourceNotFound:
          throw new NotFoundException({ ...error, message: error.message });
        default:
          throw new InternalServerErrorException();
      }
    }

    const { person } = result.value;

    return GetPersonPresenter.toHttp(person);
  }
}
