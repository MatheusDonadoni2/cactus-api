import { Injectable } from '@nestjs/common';
import { PGService } from '@infra/database/pg/pg.service';
import { Person } from '@backOffice/entities/person';

@Injectable()
export class PersonRepository {
  constructor(private pgService: PGService) {}

  async create(person: Person) {
    await this.pgService.query({
      text: 'INSERT INTO persons(id, name) VALUES($1, $2)',
      values: [person.id.toString(), person.getName()],
    });
  }
}
