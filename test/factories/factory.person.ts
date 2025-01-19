import { faker } from '@faker-js/faker';
import { Injectable } from '@nestjs/common';
import { UniqueEntityId } from 'src/core/entities/unique-entity-id';
import { Person, IPerson } from 'src/domain/back-office/entities/person';
import { PersonRepository } from 'src/infra/database/pg/repositories/person-repository';

export function makePerson(override?: Partial<IPerson>, id?: UniqueEntityId) {
  const props = {
    name: faker.person.fullName(),
    ...override,
  };

  const person = Person.create(props, id);

  return person;
}

@Injectable()
export class FactoryPerson {
  constructor(private personRepository: PersonRepository) {}

  async makePersonOnDatabase(
    data: Partial<IPerson> = {},
    id?: UniqueEntityId,
  ): Promise<Person> {
    const person = makePerson(data, id);

    await this.personRepository.create(person);

    return person;
  }
}
