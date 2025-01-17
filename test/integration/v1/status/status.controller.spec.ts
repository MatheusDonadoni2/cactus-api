import { Test } from '@nestjs/testing';
import { INestApplication } from '@nestjs/common';
import { AppModule } from 'src/app.module';

import * as request from 'supertest';
import { GenerateJWTTokenService } from 'src/infra/authentication/services/generate.jwt.token.service';
import { DatabaseService } from 'test/setup.e2e';

describe('GET /v1/status', () => {
  let app: INestApplication;
  let jwt: GenerateJWTTokenService;

  beforeEach(async () => {
    await DatabaseService.start();

    const moduleRef = await Test.createTestingModule({
      imports: [AppModule],
    }).compile();

    app = moduleRef.createNestApplication();
    jwt = moduleRef.get(GenerateJWTTokenService);

    await app.init();
  });

  describe('Anonymous uses', () => {
    test('Retrieving current system status', async () => {
      const response = await request(app.getHttpServer()).get('/v1/status');

      expect(response.statusCode).toEqual(401);
    });
  });

  describe('Authenticated uses', () => {
    test('Retrieving current system status', async () => {
      const JWTResult = await jwt.execute({});

      let access_token: string;

      if (JWTResult.isRight()) {
        access_token = JWTResult.value.access_token;
      }

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
