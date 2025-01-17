import { Injectable } from '@nestjs/common';
import { Person } from 'src/domain/back-office/entities/person';
import { PersonRepository } from 'src/infra/database/pg/repositories/person-repository';

@Injectable()
export class CreatePersonService {
  constructor(private personRepository: PersonRepository) {}
  async execute() {
    const person = Person.create({ name: 'Matheus' });

    await this.personRepository.create(person);

    return person;
  }
}
