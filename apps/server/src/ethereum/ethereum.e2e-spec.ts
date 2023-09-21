import { INestApplication } from '@nestjs/common';
import request from 'supertest';
import { MongoMemoryServer } from 'mongodb-memory-server';
import { generatePrivateKey, privateKeyToAccount } from 'viem/accounts';
import { SiweMessage } from 'siwe';
import { setupMongoDb, setupTestApplication } from '../../tests/helper';
import { getRandomHexString } from '../utils';

// eslint-disable-next-line @typescript-eslint/no-explicit-any
function getDomain(server: any): string {
  server.listen();
  const address = server.address();
  return `127.0.0.1:${address.port}`;
}

function generateSiweMessage(domain: string, address: string, nonce: string) {
  const rawMessage = new SiweMessage({
    domain,
    address,
    statement: 'Sign in with Ethereum to the app.',
    uri: `http://${domain}`,
    version: '1',
    chainId: 1,
    nonce,
  });
  const message = rawMessage.prepareMessage() as `0x${string}`;

  return message;
}

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
    const message = generateSiweMessage(
      domain,
      account.address,
      challengeRes.body.value
    );
    const signature = await account.signMessage({ message });
    const payload = {
      id,
      account: account.address,
      message,
      signature,
    };

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
    const message = generateSiweMessage(
      domain,
      account.address,
      getRandomHexString()
    );
    const signature = await account.signMessage({ message });
    const payload = {
      id,
      account: account.address,
      message,
      signature,
    };

    request(server)
      .post('/api/auth/ethereum/login')
      .send(payload)
      .set('Authorization', `Bearer ${token}`)
      .expect(401);
  });
});
