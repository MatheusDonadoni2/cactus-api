import { Test } from '@nestjs/testing';
import { INestApplication } from '@nestjs/common';
import { AppModule } from 'src/app.module';

import * as request from 'supertest';
import { DatabaseService } from 'test/setup.e2e';
import { FactoryUser, makeUser } from 'test/factories/factory.user';
import { CryptographyModule } from 'src/infra/cryptography/cryptography.module';
import { FactoryPerson } from 'test/factories/factory.person';
import { AuthenticateUserService } from 'src/domain/back-office/services/user/services/authenticate.user.service';
import { DatabaseModule } from 'src/infra/database/database.module';

describe('GET /v1/status', () => {
  let app: INestApplication;
  let factoryUser: FactoryUser;
  let authenticateUserService: AuthenticateUserService;

  beforeEach(async () => {
    await DatabaseService.start();

    const moduleRef = await Test.createTestingModule({
      imports: [AppModule, DatabaseModule, CryptographyModule],
      providers: [FactoryPerson, FactoryUser],
    }).compile();

    app = moduleRef.createNestApplication();
    factoryUser = moduleRef.get(FactoryUser);
    authenticateUserService = moduleRef.get(AuthenticateUserService);

    await app.init();
  });

  describe('Retrieving current system status', () => {
    test('without access token', async () => {
      const response = await request(app.getHttpServer()).get('/v1/status');
      expect(response.statusCode).toEqual(401);
    });

    test('with access token', async () => {
      const fake_user = makeUser();

      await factoryUser.makeUserOnDatabase({
        person: fake_user.getPerson(),
        username: fake_user.getUsername(),
        password: fake_user.getPassword(),
      });

      const authenticateUser = await authenticateUserService.execute({
        username: fake_user.getUsername(),
        password: fake_user.getPassword(),
      });

      if (authenticateUser.isLeft()) {
        throw authenticateUser.value;
      }

      const { access_token } = authenticateUser.value;

      const response = await request(app.getHttpServer())
        .get('/v1/status')
        .set('Authorization', `Bearer ${access_token}`);

      expect(response.statusCode).toEqual(200);

      const { body } = response;

      expect(body.data.updated_at).toBeDefined();
      expect(parseInt(body.data.dependencies.database.version)).toEqual(16);
      expect(body.data.dependencies.database.max_connections).toEqual(100);
      expect(body.data.dependencies.database.opened_connections).toEqual(1);
    });
  });
});
