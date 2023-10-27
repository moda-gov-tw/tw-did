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
import { UsersService } from './user.service';
import { NationalService } from '../national/national.service';

describe('UsersModule', () => {
  let app: INestApplication;
  let mongod: MongoMemoryServer;
  let usersService: UsersService;
  let nationalService: NationalService;

  async function fullRegister() {
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

    return { commitment, token, userId: id };
  }

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

  it('should get 2 array of semaphore commitments', async () => {
    const server = app.getHttpServer();
    const { commitment } = await fullRegister();

    const expcetedCommitment = {
      activated: [commitment],
      revoked: [],
    };

    await request(server)
      .get('/api/users/commitments')
      .expect((res) => {
        expect(res.body).toEqual(expcetedCommitment);
      });
  });

  it('should move the commitment from activated to revoked array', async () => {
    const server = app.getHttpServer();
    const { commitment, token } = await fullRegister();

    const expcetedCommitment = {
      activated: [commitment],
      revoked: [],
    };

    await request(server)
      .get('/api/users/commitments')
      .expect((res) => {
        expect(res.body).toEqual(expcetedCommitment);
      });

    expcetedCommitment.activated = [];
    expcetedCommitment.revoked = [commitment];

    await request(server)
      .post('/api/users/revoke')
      .set('Authorization', `Bearer ${token}`);
  });

  it('should have one more id in revocation array', async () => {
    const server = app.getHttpServer();
    const { token, userId } = await fullRegister();

    const res = await request(server)
      .get(`/api/users/${userId}`)
      .set('Authorization', `Bearer ${token}`);
    const identityId = res.body.currentIdentity._id;

    await request(server)
      .get('/api/users/revocation')
      .expect((res) => {
        expect(res.body).toEqual([]);
      });

    await request(server)
      .post('/api/users/revoke')
      .set('Authorization', `Bearer ${token}`);

    await request(server)
      .get('/api/users/revocation')
      .expect((res) => {
        expect(res.body).toEqual([identityId]);
      });
  });
});
