import { INestApplication } from '@nestjs/common';
import { Identity } from '@semaphore-protocol/identity';
import request from 'supertest';
import { MongoMemoryServer } from 'mongodb-memory-server';
import { generatePrivateKey, privateKeyToAccount } from 'viem/accounts';
import {
  generatePayload,
  getDomain,
  setupMongoDb,
  setupTestApplication,
} from '../../tests/helper';

describe('UsersModule', () => {
  let app: INestApplication;
  let mongod: MongoMemoryServer;

  beforeEach(async () => {
    mongod = await setupMongoDb();
    app = await setupTestApplication(mongod.getUri());
  });

  afterEach(async () => {
    await mongod.stop();
    await app.close();
  });

  it('should get an array of semaphore commitments', async () => {
    const server = app.getHttpServer();
    const domain = getDomain(server);

    const res = await request(server)
      .post('/api/auth/national/register')
      .send({ username: 'username', password: 'password' });

    const { id, token } = res.body;

    const challengeRes = await request(server)
      .post('/api/auth/ethereum/challenge')
      .set('Authorization', `Bearer ${token}`)
      .expect(201);

    const privateKey = generatePrivateKey();
    const account = privateKeyToAccount(privateKey);
    const payload = await generatePayload(
      id,
      domain,
      account,
      challengeRes.body.value
    );

    const identity = new Identity();
    const commitment = identity.commitment.toString();

    await request(server)
      .post('/api/auth/ethereum/login')
      .send(payload)
      .set('Authorization', `Bearer ${token}`);

    await request(server)
      .put('/api/auth/semaphore')
      .send({ id, commitment })
      .set('Authorization', `Bearer ${token}`);

    await request(server)
      .get('/api/users/commitments')
      .expect((res) => {
        expect(res.body).toEqual([commitment]);
      });
  });
});
