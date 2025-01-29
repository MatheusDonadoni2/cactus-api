import { Injectable } from '@nestjs/common';

import { Either, left, right } from '~/core/error/either';
import { Person } from '~backOffice/entities/person';
import { IPersonRepository } from '~backOffice/repositories/person.repository';
import { CreateLegalPersonService } from '~backOffice/services/legalPerson/create.legal.person.service';
import { CreateNaturalPersonService } from '~backOffice/services/naturalPerson/create.natural.person.service';
import { InternalServerError } from '~customErrors/internal-server-error';
import { ResourceIsInvalid } from '~customErrors/resource.is.invalid';
import { ResourceSentAreNotEnough } from '~customErrors/resource.sent.are.not.enough';

import { GetLegalPersonByCNPJService } from '../legalPerson/get.legal.person.by.cnpj.service';

interface CreatePersonServiceRequest {
  name: string;
  legal_person?: {
    cnpj: string;
  };
  natural_person?: {
    cpf: string;
  };
}

type CreatePersonServiceResponse = Either<
  InternalServerError | ResourceSentAreNotEnough | ResourceIsInvalid,
  {
    person: Person;
  }
>;

@Injectable()
export class CreatePersonService {
  constructor(
    private personRepository: IPersonRepository,
    private createLegalPersonService: CreateLegalPersonService,
    private getLegalPersonByCNPJService: GetLegalPersonByCNPJService,
    private createNaturalPersonService: CreateNaturalPersonService,
  ) {}

  async execute(
    props: CreatePersonServiceRequest,
  ): Promise<CreatePersonServiceResponse> {
    try {
      const { name, legal_person, natural_person } = props;

      if (!legal_person && !natural_person) {
        return left(
          new ResourceSentAreNotEnough(
            'Legal person and Natural person cannot be undefined',
          ),
        );
      }

      const person = Person.create({ name });

      await this.personRepository.startTransaction();

      await this.personRepository.create({
        person,
      });

      if (legal_person) {
        const resultCreateLegalPersonService =
          await this.createLegalPersonService.execute({
            personId: person.id.toString(),
            CNPJ: legal_person.cnpj,
          });

        if (resultCreateLegalPersonService.isLeft()) {
          await this.personRepository.rollbackTransaction();
          return left(resultCreateLegalPersonService.value);
        }

        person.setLegalPerson(resultCreateLegalPersonService.value.legalPerson);
      }

      if (natural_person) {
        const resultCreateNaturalPersonService =
          await this.createNaturalPersonService.execute({
            personId: person.id.toString(),
            CPF: natural_person.cpf,
          });

        if (resultCreateNaturalPersonService.isLeft()) {
          await this.personRepository.rollbackTransaction();
          return left(resultCreateNaturalPersonService.value);
        }

        person.setNaturalPerson(
          resultCreateNaturalPersonService.value.naturalPerson,
        );
      }

      await this.personRepository.commitTransaction();

      return right({
        person,
      });
    } catch (error) {
      return left(new InternalServerError(error));
    }
  }
}
