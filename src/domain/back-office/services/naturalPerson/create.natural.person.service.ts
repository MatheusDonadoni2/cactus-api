import { Injectable } from '@nestjs/common';
import * as validatorCPFOrCNPJ from 'cpf-cnpj-validator';

import { ResourceIsInvalid } from '~/core/error/custom-errors-class/resource.is.invalid';
import { ResourceNotFound } from '~/core/error/custom-errors-class/resource.not.found';
import { Either, left, right } from '~/core/error/either';
import { NaturalPerson } from '~backOffice/entities/natural.person';
import { INaturalPersonRepository } from '~backOffice/repositories/natural.person.repository';
import { InternalServerError } from '~customErrors/internal-server-error';

import { GetNaturalPersonByCPFService } from './get.natural.person.by.cpf.service';

interface CreateNaturalPersonServiceRequest {
  personId: string;
  CPF: string;
}

type CreateNaturalPersonServiceResponse = Either<
  InternalServerError | ResourceIsInvalid,
  {
    naturalPerson: NaturalPerson;
  }
>;

@Injectable()
export class CreateNaturalPersonService {
  constructor(
    private naturalPersonRepository: INaturalPersonRepository,
    private getNaturalPersonByCPFService: GetNaturalPersonByCPFService,
  ) {}
  async execute({
    CPF,
    personId,
  }: CreateNaturalPersonServiceRequest): Promise<CreateNaturalPersonServiceResponse> {
    try {
      const naturalPerson = NaturalPerson.create({
        CPF,
      });

      const isValidCPF = validatorCPFOrCNPJ.cpf.isValid(naturalPerson.getCPF());

      if (!isValidCPF) {
        return left(new ResourceIsInvalid('CPF'));
      }

      const cpfAlreadyExist = await this.getNaturalPersonByCPFService.execute({
        cpf: naturalPerson.getCPF(),
      });

      if (
        cpfAlreadyExist.isLeft() &&
        cpfAlreadyExist.value.constructor !== ResourceNotFound
      ) {
        return left(cpfAlreadyExist.value);
      }

      if (cpfAlreadyExist.isRight()) {
        return left(new ResourceIsInvalid('CPF already exists'));
      }

      const result = await this.naturalPersonRepository.create({
        personId,
        naturalPerson,
      });

      if (result.isLeft()) {
        return left(result.value);
      }

      return right({
        naturalPerson,
      });
    } catch (error) {
      return left(new InternalServerError(error));
    }
  }
}
