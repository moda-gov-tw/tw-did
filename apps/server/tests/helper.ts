import { INestApplication } from '@nestjs/common';
import { MongooseModule } from '@nestjs/mongoose';
import { Test, TestingModule } from '@nestjs/testing';
import { MongoMemoryServer } from 'mongodb-memory-server';
import { UsersModule } from '../src/user/user.module';
import { AuthModule } from '../src/auth/auth.module';
import { SiweMessage } from 'siwe';
import { PrivateKeyAccount } from 'viem/accounts';
import { ConfigModule } from '@nestjs/config';

export function setupMongoDb(): Promise<MongoMemoryServer> {
  return MongoMemoryServer.create();
}

export async function setupTestApplication(
  mongoUri: string
): Promise<{ app: INestApplication; testingModule: TestingModule }> {
  const config = {
    twfido: {
      apiUrl: '',
      apiKey: '',
      serviceId: '',
    },
  };

  const testingModule: TestingModule = await Test.createTestingModule({
    imports: [
      ConfigModule.forRoot({
        load: [() => config],
      }),
      MongooseModule.forRoot(mongoUri),
      UsersModule,
      AuthModule,
    ],
  }).compile();

  const app = testingModule.createNestApplication();
  app.setGlobalPrefix('api');
  await app.init();
  return { app, testingModule };
}

// eslint-disable-next-line @typescript-eslint/no-explicit-any
export function getDomain(server: any): string {
  server.listen();
  const address = server.address();
  return `127.0.0.1:${address.port}`;
}

export function generateSiweMessage(
  domain: string,
  address: string,
  nonce: string
) {
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

export async function generatePayload(
  id: string,
  domain: string,
  account: PrivateKeyAccount,
  nonce: string
) {
  const message = generateSiweMessage(domain, account.address, nonce);
  const signature = await account.signMessage({ message });
  const payload = {
    id,
    account: account.address,
    message,
    signature,
  };

  return payload;
}
