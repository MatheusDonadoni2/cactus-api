import { faker } from '@faker-js/faker/.';
import { INestApplication } from '@nestjs/common';
import { Test } from '@nestjs/testing';
import * as request from 'supertest';
import { FactoryModule } from 'test/factories/factory.module';
import { FactoryUser, makeUser } from 'test/factories/factory.user';
import { DatabaseService } from 'test/setup.e2e';

import { AppModule } from '~/app.module';

describe('GET /v1/status', () => {
  let app: INestApplication;
  let factoryUser: FactoryUser;

  beforeEach(async () => {
    await DatabaseService.start();

    const moduleRef = await Test.createTestingModule({
      imports: [AppModule, FactoryModule],
      providers: [],
    }).compile();

    app = moduleRef.createNestApplication();

    factoryUser = moduleRef.get(FactoryUser);

    await app.init();
  });

  describe('Authenticate user', () => {
    describe('🟢 should be able to authenticate a user', () => {
      test('with all correct credentials ', async () => {
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

    describe('🔴 should not able be to authenticate a user', () => {
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
    });
  });
});
