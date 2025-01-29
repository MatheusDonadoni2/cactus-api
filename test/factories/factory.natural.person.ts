import { Injectable } from '@nestjs/common';
import * as fakerBR from 'cpf-cnpj-validator';

import { UniqueEntityId } from '~/core/entities/unique-entity-id';
import {
  INaturalPerson,
  NaturalPerson,
} from '~backOffice/entities/natural.person';
import { INaturalPersonRepository } from '~backOffice/repositories/natural.person.repository';

export function makeNaturalPerson(
  override?: Partial<INaturalPerson>,
  id?: UniqueEntityId,
) {
  const props: INaturalPerson = {
    CPF: fakerBR.cpf.generate(),
    ...override,
  };

  const naturalPerson = NaturalPerson.create(props, id);

  return naturalPerson;
}

@Injectable()
export class FactoryNaturalPerson {
  constructor(private naturalPersonRepository: INaturalPersonRepository) {}

  async makeNaturalPersonOnDatabase(
    personId: string,
    data: Partial<INaturalPerson> = {},
    id?: UniqueEntityId,
  ): Promise<NaturalPerson> {
    const naturalPerson = makeNaturalPerson(data, id);

    await this.naturalPersonRepository.create({
      naturalPerson,
      personId,
    });

    return naturalPerson;
  }
}
