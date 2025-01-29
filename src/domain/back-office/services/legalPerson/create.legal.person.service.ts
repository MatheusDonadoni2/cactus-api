import { Injectable } from '@nestjs/common';
import * as validatorCPFOrCNPJ from 'cpf-cnpj-validator';

import { ResourceIsInvalid } from '~/core/error/custom-errors-class/resource.is.invalid';
import { Either, left, right } from '~/core/error/either';
import { LegalPerson } from '~backOffice/entities/legal.person';
import { ILegalPersonRepository } from '~backOffice/repositories/legal.person.repository';
import { InternalServerError } from '~customErrors/internal-server-error';
import { ResourceNotFound } from '~customErrors/resource.not.found';

import { GetLegalPersonByCNPJService } from './get.legal.person.by.cnpj.service';

interface CreateLegalPersonServiceRequest {
  personId: string;
  CNPJ: string;
}

type CreateLegalPersonServiceResponse = Either<
  InternalServerError | ResourceIsInvalid | ResourceNotFound,
  {
    legalPerson: LegalPerson;
  }
>;

@Injectable()
export class CreateLegalPersonService {
  constructor(
    private legalPersonRepository: ILegalPersonRepository,
    private getLegalPersonByCNPJService: GetLegalPersonByCNPJService,
  ) {}
  async execute({
    CNPJ,
    personId,
  }: CreateLegalPersonServiceRequest): Promise<CreateLegalPersonServiceResponse> {
    try {
      const legalPerson = LegalPerson.create({
        CNPJ,
      });

      const isValidCNPJ = validatorCPFOrCNPJ.cnpj.isValid(
        legalPerson.getCNPJ(),
      );

      if (!isValidCNPJ) {
        return left(new ResourceIsInvalid('CNPJ'));
      }

      const cnpjAlreadyExist = await this.getLegalPersonByCNPJService.execute({
        cnpj: legalPerson.getCNPJ(),
      });

      if (
        cnpjAlreadyExist.isLeft() &&
        cnpjAlreadyExist.value.constructor !== ResourceNotFound
      ) {
        return left(cnpjAlreadyExist.value);
      }

      if (cnpjAlreadyExist.isRight()) {
        return left(new ResourceIsInvalid('CNPJ already exists'));
      }

      const result = await this.legalPersonRepository.create({
        personId,
        legalPerson,
      });

      if (result.isLeft()) {
        return left(result.value);
      }

      return right({
        legalPerson,
      });
    } catch (error) {
      return left(new InternalServerError(error));
    }
  }
}
