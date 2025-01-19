import * as request from 'supertest';
import { Test } from '@nestjs/testing';
import { INestApplication } from '@nestjs/common';

import { AppModule } from 'src/app.module';
import { DatabaseModule } from 'src/infra/database/database.module';
import { FactoryUser, makeUser } from 'test/factories/factory.user';
import { FactoryPerson } from 'test/factories/factory.person';
import { CryptographyModule } from 'src/infra/cryptography/cryptography.module';
import { DatabaseService } from 'test/setup.e2e';
import { faker } from '@faker-js/faker/.';

describe('GET /v1/status', () => {
  let app: INestApplication;
  let factoryUser: FactoryUser;

  beforeEach(async () => {
    await DatabaseService.start();

    const moduleRef = await Test.createTestingModule({
      imports: [AppModule, DatabaseModule, CryptographyModule],
      providers: [FactoryPerson, FactoryUser],
    }).compile();

    app = moduleRef.createNestApplication();

    factoryUser = moduleRef.get(FactoryUser);

    await app.init();
  });

  describe('Authenticate user', () => {
    test('with a incorrect password', async () => {
      const fake_user = makeUser();

      await factoryUser.makeUserOnDatabase({
        password: fake_user.getPassword(),
        username: fake_user.getUsername(),
      });

      const response = await request(app.getHttpServer())
        .get('/v1/users/auth')
        .send({
          username: fake_user.getUsername(),
          password: fake_user.getPassword(),
        });
      const data = response.body.data;
      expect(typeof data.access_token).toEqual('string');
    });

    test('with a all correct credentials ', async () => {
      const fake_user = makeUser();

      await factoryUser.makeUserOnDatabase({
        password: fake_user.getPassword(),
        username: fake_user.getUsername(),
      });

      const response = await request(app.getHttpServer())
        .get('/v1/users/auth')
        .send({
          username: fake_user.getUsername(),
          password: faker.internet.password(),
        });

      expect(response.statusCode).toEqual(401);
    });
  });
});
