import { faker } from '@faker-js/faker';
import { Injectable } from '@nestjs/common';

import { UniqueEntityId } from '~/core/entities/unique-entity-id';
import { IUser, User } from '~backOffice/entities/user';
import { CryptographyService } from '~infra/cryptography/services/cryptography.service';
import { UserRepository } from '~infra/database/pg/repositories/user.repository';

import { FactoryPerson, makePerson } from './factory.person';

export function makeUser(override?: Partial<IUser>, id?: UniqueEntityId) {
  const props: IUser = {
    person: makePerson(),
    password: faker.internet.password(),
    username: faker.internet.username(),
    ...override,
  };
  return User.create(props, id);
}

@Injectable()
export class FactoryUser {
  constructor(
    private userRepository: UserRepository,
    private cryptographyService: CryptographyService,
    private factoryPerson: FactoryPerson,
  ) {}

  async makeUserOnDatabase(
    data: Partial<IUser> = {},
    id?: UniqueEntityId,
  ): Promise<User> {
    const user = makeUser(
      {
        ...data,
      },
      id,
    );

    await this.factoryPerson.makePersonOnDatabase(
      {
        name: user.getPerson().getName(),
      },
      user.getPerson().id,
    );

    const cryptographyPassword = await this.cryptographyService.hash(
      user.getPassword(),
    );

    user.setPassword(cryptographyPassword);

    await this.userRepository.create(user);

    return user;
  }
}
