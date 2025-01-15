import { Injectable } from '@nestjs/common';
import { PGService } from '../pg.service';
import { User } from 'src/domain/back-office/entities/user';
import { Person } from 'src/domain/back-office/entities/person';

@Injectable()
export class UserRepository {
  constructor(private pgService: PGService) {}

  async getByUsername(username: string): Promise<User | undefined> {
    const result = await this.pgService.query({
      text: 'SELECT * FROM users WHERE username = $1',
      values: [username],
    });

    if (result.rowCount !== 1) {
      return undefined;
    } else {
      return User.create({
        person: {} as Person,
        password: result.rows[0].password,
        username: result.rows[0].username,
      });
    }
  }
}
