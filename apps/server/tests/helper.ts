import { INestApplication } from '@nestjs/common';
import { MongooseModule } from '@nestjs/mongoose';
import { Test, TestingModule } from '@nestjs/testing';
import { MongoMemoryServer } from 'mongodb-memory-server';
import { UsersModule } from '../src/user/user.module';
import { AuthModule } from '../src/auth/auth.module';

export function setupMongoDb(): Promise<MongoMemoryServer> {
  return MongoMemoryServer.create();
}

export async function setupTestApplication(
  mongoUri: string
): Promise<INestApplication> {
  const testModule: TestingModule = await Test.createTestingModule({
    imports: [MongooseModule.forRoot(mongoUri), UsersModule, AuthModule],
  }).compile();

  const app = testModule.createNestApplication();
  app.setGlobalPrefix('api');
  await app.init();
  return app;
}
