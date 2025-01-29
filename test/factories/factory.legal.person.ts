import { Injectable } from '@nestjs/common';
import * as fakerBR from 'cpf-cnpj-validator';

import { UniqueEntityId } from '~/core/entities/unique-entity-id';
import { ILegalPersonRepository } from '~/domain/back-office/repositories/legal.person.repository';
import { ILegalPerson, LegalPerson } from '~backOffice/entities/legal.person';

export function makeLegalPerson(
  override?: Partial<ILegalPerson>,
  id?: UniqueEntityId,
) {
  const props: ILegalPerson = {
    CNPJ: fakerBR.cnpj.generate(),
    ...override,
  };

  const legalPerson = LegalPerson.create(props, id);

  return legalPerson;
}

@Injectable()
export class FactoryLegalPerson {
  constructor(private legalPersonRepository: ILegalPersonRepository) {}

  async makeLegalPersonOnDatabase(
    personId: string,
    data: Partial<ILegalPerson>,
    id?: UniqueEntityId,
  ): Promise<LegalPerson> {
    const legalPerson = makeLegalPerson(data, id);

    await this.legalPersonRepository.create({
      legalPerson,
      personId,
    });

    return legalPerson;
  }
}
