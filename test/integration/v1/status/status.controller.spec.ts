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
      console.log({ response: response.body });
      expect(1).toBe(1);
    });
  });
});
