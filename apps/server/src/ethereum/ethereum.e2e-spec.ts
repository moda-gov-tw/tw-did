import { INestApplication } from '@nestjs/common';
import request from 'supertest';
import { MongoMemoryServer } from 'mongodb-memory-server';
import { generatePrivateKey, privateKeyToAccount } from 'viem/accounts';
import {
  generatePayload,
  getDomain,
  setupMongoDb,
  setupTestApplication,
} from '../../tests/helper';
import { getRandomHexString } from '../utils';

describe('EthereumModule', () => {
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

  it('should login with an ethereum account', async () => {
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

    await request(server)
      .post('/api/auth/ethereum/login')
      .send(payload)
      .set('Authorization', `Bearer ${token}`)
      .expect(201)
      .expect((res) => {
        expect(res.body).toEqual({ address: account.address });
      });
  });

  it('should login failed with incorrect nonce', async () => {
    const server = app.getHttpServer();
    const domain = getDomain(server);

    const res = await request(server)
      .post('/api/auth/national/register')
      .send({ username: 'username', password: 'password' });

    const { id, token } = res.body;

    const privateKey = generatePrivateKey();
    const account = privateKeyToAccount(privateKey);
    const payload = await generatePayload(
      id,
      domain,
      account,
      getRandomHexString()
    );

    request(server)
      .post('/api/auth/ethereum/login')
      .send(payload)
      .set('Authorization', `Bearer ${token}`)
      .expect(401);
  });

  it('should fail to challenge without a JWT token', async () => {
    const server = app.getHttpServer();
    return request(server).post('/api/auth/ethereum/challenge').expect(401);
  });
});
