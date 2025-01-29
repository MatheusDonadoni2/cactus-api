import { Injectable } from '@nestjs/common';

import { InternalServerError } from '~/core/error/custom-errors-class/internal-server-error';
import { ResourceNotFound } from '~/core/error/custom-errors-class/resource.not.found';
import { Either, left, right } from '~/core/error/either';
import { IPersonRepository } from '~/domain/back-office/repositories/person.repository';
import { Person } from '~backOffice/entities/person';

interface GetPersonByIdServiceRequest {
  id: string;
}

type GetPersonByIdServiceResponse = Either<
  InternalServerError | ResourceNotFound,
  {
    person: Person;
  }
>;

@Injectable()
export class GetPersonByIdService {
  constructor(private personRepository: IPersonRepository) {}
  async execute({
    id,
  }: GetPersonByIdServiceRequest): Promise<GetPersonByIdServiceResponse> {
    const result = await this.personRepository.getById({
      id,
    });

    if (result.isLeft()) {
      return left(new InternalServerError());
    }

    const { person } = result.value;

    return right({
      person,
    });
  }
}
