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

  describe('Authenticate user', () => {
    test('Retrieving access token', async () => {
      const response = await request(app.getHttpServer()).get('/v1/users/auth');
      const data = response.body.data;
      expect(typeof data.access_token).toEqual('string');
    });
  });
});
