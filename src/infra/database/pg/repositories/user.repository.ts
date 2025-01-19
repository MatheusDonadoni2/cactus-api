import { Injectable } from '@nestjs/common';

import { UniqueEntityId } from '~/core/entities/unique-entity-id';
import { Person } from '~backOffice/entities/person';
import { User } from '~backOffice/entities/user';
import { PGService } from '~infra/database/pg/pg.service';

@Injectable()
export class UserRepository {
  constructor(private pgService: PGService) {}

  async create(user: User) {
    await this.pgService.query({
      text: `INSERT INTO users(id, person_id, username, password) VALUES($1, $2, $3, $4);`,
      values: [
        user.id.toString(),
        user.getPerson().id.toString(),
        user.getUsername(),
        user.getPassword(),
      ],
    });
  }

  async getByUsername(username: string): Promise<User | undefined> {
    const result = await this.pgService.query({
      text: `
        SELECT u.*, P.name FROM users U
          INNER JOIN persons P on
            p.id = U.person_id
        WHERE username = $1
      `,
      values: [username],
    });

    if (result.rowCount !== 1) {
      return undefined;
    } else {
      return User.create({
        person: Person.create(
          {
            name: result.rows[0].name,
          },
          new UniqueEntityId(result.rows[0].person_id),
        ),
        password: result.rows[0].password,
        username: result.rows[0].username,
      });
    }
  }
}
