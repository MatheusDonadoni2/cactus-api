import { faker } from '@faker-js/faker';
import { Injectable } from '@nestjs/common';
import { User, IUser } from 'src/domain/back-office/entities/user';
import { PGService } from 'src/infra/database/pg/pg.service';
import { FactoryPerson, makePerson } from './factory.person';
import { Person } from 'src/domain/back-office/entities/person';
import { CryptographyService } from 'src/infra/cryptography/services/cryptography.service';

export function makeUser(override?: Partial<IUser>) {
  return User.create({
    person: makePerson(),
    password: faker.internet.password(),
    username: faker.internet.username(),
    ...override,
  });
}

@Injectable()
export class FactoryUser {
  constructor(
    private pgService: PGService,
    private factoryPerson: FactoryPerson,
    private cryptographyService: CryptographyService,
  ) {}

  async makeUserOnDatabase(data: Partial<IUser> = {}): Promise<User> {
    let person: Person;

    if (data.person) {
      person = await this.factoryPerson.makePersonOnDatabase({
        name: data.person.getName(),
      });
    } else {
      const make_person = makePerson();
      person = await this.factoryPerson.makePersonOnDatabase({
        name: make_person.getName(),
      });
    }

    const user = makeUser({
      person,
      ...data,
    });

    const cryptographyPassword = await this.cryptographyService.hash(
      user.getPassword(),
    );

    user.setPassword(cryptographyPassword);

    await this.pgService.query({
      text: `INSERT INTO users(id, person_id, username, password) VALUES($1, $2, $3, $4);`,
      values: [
        user.id.toString(),
        user.getPerson().id.toString(),
        user.getUsername(),
        user.getPassword(),
      ],
    });

    return user;
  }
}
