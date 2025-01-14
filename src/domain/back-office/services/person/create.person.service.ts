import { Injectable } from '@nestjs/common';
import { Person } from 'src/domain/back-office/entities/person';

@Injectable()
export class CreatePersonService {
  async execute() {
    const person = Person.create({ name: 'Matheus' });
    return person;
  }
}
