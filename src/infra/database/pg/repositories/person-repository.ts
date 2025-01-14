import { Injectable } from '@nestjs/common';
import { PGService } from '../pg.service';
import { Person } from 'src/domain/back-office/entities/person';

@Injectable()
export class PersonRepository {
  constructor(private pgService: PGService) {}

  async create(person: Person) {
    await this.pgService.query({
      text: 'INSERT INTO persons(id, name) VALUES(?, ?)',
      values: [person.id.toString(), person.getName()],
    });
  }
}
