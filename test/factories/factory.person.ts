import { faker } from '@faker-js/faker';
import { Injectable } from '@nestjs/common';
import { Person, IPerson } from 'src/domain/back-office/entities/person';
import { PGService } from 'src/infra/database/pg/pg.service';

export function makePerson(override?: Partial<IPerson>) {
  return Person.create({
    name: faker.person.fullName(),
    ...override,
  });
}

@Injectable()
export class FactoryPerson {
  constructor(private pgService: PGService) {}

  async makePersonOnDatabase(data: Partial<IPerson> = {}): Promise<Person> {
    const person = makePerson(data);

    await this.pgService.query({
      text: `INSERT INTO persons(id, name) VALUES($1, $2);`,
      values: [person.id.toString(), person.getName()],
    });

    return person;
  }
}
