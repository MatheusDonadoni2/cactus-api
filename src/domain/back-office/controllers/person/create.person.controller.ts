import {
  BadRequestException,
  Body,
  Controller,
  InternalServerErrorException,
  Post,
} from '@nestjs/common';

import { ResourceIsInvalid } from '~/core/error/custom-errors-class/resource.is.invalid';
import { ResourceSentAreNotEnough } from '~/core/error/custom-errors-class/resource.sent.are.not.enough';
import { CreatePersonService } from '~backOffice/services/person/create.person.service';

import { CreatePersonPresenter } from './create.person.presenter';

interface CreatePersonControllerRequest {
  name: string;
  legal_person?: {
    cnpj: string;
  };
  natural_person?: {
    cpf: string;
  };
}

@Controller('v1/persons')
export class CreatePersonController {
  constructor(private createPersonService: CreatePersonService) {}

  @Post()
  async handle(@Body() body: CreatePersonControllerRequest) {
    const { name, legal_person, natural_person } = body;
    const result = await this.createPersonService.execute({
      name,
      legal_person,
      natural_person,
    });

    if (result.isLeft()) {
      const error = result.value;

      switch (error.constructor) {
        case ResourceSentAreNotEnough:
          throw new BadRequestException({ ...error, message: error.message });
        case ResourceIsInvalid:
          throw new BadRequestException({ ...error, message: error.message });
        default:
          throw new InternalServerErrorException();
      }
    }

    const { person } = result.value;

    return CreatePersonPresenter.toHttp(person);
  }
}
