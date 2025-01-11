import { Test } from '@nestjs/testing';
import { INestApplication } from '@nestjs/common';
import { AppModule } from '../../../../src/app.module';

import * as request from 'supertest';

describe('GET /v1/status', () => {
  let app: INestApplication;

  beforeEach(async () => {
    const moduleRef = await Test.createTestingModule({
      imports: [AppModule],
    }).compile();

    app = moduleRef.createNestApplication();
    await app.init();
  });

  describe('Anonymous uses', () => {
    test('Retrieving current system status', async () => {
      const response = await request(app.getHttpServer()).get('/v1/status');

      expect(response.statusCode).toEqual(200);

      const { body } = response;

      expect(body.data.updated_at).toBeDefined();
      expect(parseInt(body.data.dependencies.database.version)).toEqual(16);
      expect(body.data.dependencies.database.max_connections).toEqual(100);
      expect(body.data.dependencies.database.opened_connections).toEqual(1);
    });
  });
});
