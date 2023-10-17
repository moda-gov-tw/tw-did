import { INestApplication } from '@nestjs/common';
import request from 'supertest';
import { MongoMemoryServer } from 'mongodb-memory-server';
import { setupMongoDb, setupTestApplication } from '../../tests/helper';

describe('NationalModule', () => {
  let app: INestApplication;
  let mongod: MongoMemoryServer;

  beforeEach(async () => {
    mongod = await setupMongoDb();
    const result = await setupTestApplication(mongod.getUri());
    app = result.app;
  });

  afterEach(async () => {
    await mongod.stop();
    await app.close();
  });

  it('should fail to check without a JWT token', async () => {
    return request(app.getHttpServer())
      .get('/api/auth/national/check')
      .expect(401);
  });
});
