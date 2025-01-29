import { Injectable } from '@nestjs/common';

import { Either, left, right } from '~/core/error/either';
import { NaturalPerson } from '~backOffice/entities/natural.person';
import { INaturalPersonRepository } from '~backOffice/repositories/natural.person.repository';
import { InternalServerError } from '~customErrors/internal-server-error';
import { ResourceNotFound } from '~customErrors/resource.not.found';

interface GetNaturalPersonByCPFServiceRequest {
  cpf: string;
}

type GetNaturalPersonByCPFServiceResponse = Either<
  InternalServerError | ResourceNotFound,
  {
    naturalPerson: NaturalPerson;
  }
>;

@Injectable()
export class GetNaturalPersonByCPFService {
  constructor(private naturalPersonRepository: INaturalPersonRepository) {}
  async execute({
    cpf,
  }: GetNaturalPersonByCPFServiceRequest): Promise<GetNaturalPersonByCPFServiceResponse> {
    const result = await this.naturalPersonRepository.getByCPF({
      cpf,
    });

    if (result.isLeft()) {
      return left(result.value);
    }

    const { naturalPerson } = result.value;

    return right({
      naturalPerson,
    });
  }
}
