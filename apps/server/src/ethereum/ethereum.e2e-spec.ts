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
import { UsersService } from '../user/user.service';
import { NationalService } from '../national/national.service';

describe('EthereumModule', () => {
  let app: INestApplication;
  let mongod: MongoMemoryServer;
  let usersService: UsersService;
  let nationalService: NationalService;

  beforeEach(async () => {
    mongod = await setupMongoDb();
    const result = await setupTestApplication(mongod.getUri());
    usersService = result.testingModule.get<UsersService>(UsersService);
    nationalService =
      result.testingModule.get<NationalService>(NationalService);
    app = result.app;
  });

  afterEach(async () => {
    await mongod.stop();
    await app.close();
  });

  it('should login with an ethereum account', async () => {
    const server = app.getHttpServer();
    const domain = getDomain(server);

    const user = await usersService.findOrCreate('A123456789');
    const { id, token } = await nationalService.generateJwtPayload(user);

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

    const user = await usersService.findOrCreate('A123456789');
    const { id, token } = await nationalService.generateJwtPayload(user);

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
