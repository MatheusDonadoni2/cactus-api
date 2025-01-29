import { Injectable } from '@nestjs/common';

import { Either, left, right } from '~/core/error/either';
import { LegalPerson } from '~backOffice/entities/legal.person';
import { ILegalPersonRepository } from '~backOffice/repositories/legal.person.repository';
import { InternalServerError } from '~customErrors/internal-server-error';
import { ResourceNotFound } from '~customErrors/resource.not.found';

interface GetLegalPersonByCNPJServiceRequest {
  cnpj: string;
}

type GetLegalPersonByCNPJServiceResponse = Either<
  InternalServerError | ResourceNotFound,
  {
    legalPerson: LegalPerson;
  }
>;

@Injectable()
export class GetLegalPersonByCNPJService {
  constructor(private legalPersonRepository: ILegalPersonRepository) {}
  async execute({
    cnpj,
  }: GetLegalPersonByCNPJServiceRequest): Promise<GetLegalPersonByCNPJServiceResponse> {
    const result = await this.legalPersonRepository.getByCNPJ({
      cnpj,
    });

    if (result.isLeft()) {
      return left(result.value);
    }

    const { legalPerson } = result.value;

    return right({
      legalPerson,
    });
  }
}
