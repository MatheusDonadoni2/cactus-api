import { faker } from '@faker-js/faker';
import { Injectable } from '@nestjs/common';
import { UniqueEntityId } from 'src/core/entities/unique-entity-id';

import { IPersonRepository } from '~/domain/back-office/repositories/person.repository';
import { IPerson, Person } from '~backOffice/entities/person';

import { FactoryLegalPerson, makeLegalPerson } from './factory.legal.person';
import {
  FactoryNaturalPerson,
  makeNaturalPerson,
} from './factory.natural.person';

export function makePerson(override?: Partial<IPerson>, id?: UniqueEntityId) {
  const props: IPerson = {
    name: faker.person.fullName(),
    legalPerson: makeLegalPerson(),
    naturalPerson: makeNaturalPerson(),
    ...override,
  };

  const person = Person.create(props, id);

  return person;
}

@Injectable()
export class FactoryPerson {
  constructor(
    private personRepository: IPersonRepository,
    private factoryNaturalPerson: FactoryNaturalPerson,
    private factoryLegalPerson: FactoryLegalPerson,
  ) {}

  async makePersonOnDatabase(
    data: Partial<IPerson> = {},
    id?: UniqueEntityId,
    config: {
      createLegalPerson?: boolean;
      createNaturalPerson?: boolean;
    } = {
      createLegalPerson: true,
      createNaturalPerson: true,
    },
  ): Promise<Person> {
    try {
      const person = makePerson(data, id);

      await this.personRepository.startTransaction();

      await this.personRepository.create({
        person,
      });

      if (config.createNaturalPerson) {
        await this.factoryNaturalPerson.makeNaturalPersonOnDatabase(
          person.id.toString(),
          {
            CPF: person.getNaturalPerson().getCPF(),
          },
          person.getNaturalPerson().id,
        );
      }

      if (config.createLegalPerson) {
        await this.factoryLegalPerson.makeLegalPersonOnDatabase(
          person.id.toString(),
          {
            CNPJ: person.getLegalPerson().getCNPJ(),
          },
          person.getLegalPerson().id,
        );
      }
      await this.personRepository.commitTransaction();

      return person;
    } catch (error) {
      console.error(error);
    }
  }
}
