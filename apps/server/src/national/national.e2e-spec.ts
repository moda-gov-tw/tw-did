import { Test, TestingModule } from '@nestjs/testing';
import { INestApplication } from '@nestjs/common';
import request from 'supertest';
import { MongoMemoryServer } from 'mongodb-memory-server';
import { MongooseModule } from '@nestjs/mongoose';
import { UsersModule } from '../user/user.module';
import { AuthModule } from '../auth/auth.module';

describe('NationalModule', () => {
  let app: INestApplication;
  let mongod: MongoMemoryServer;

  beforeAll(async () => {
    mongod = await MongoMemoryServer.create();
    const uri = mongod.getUri();

    const testModule: TestingModule = await Test.createTestingModule({
      imports: [MongooseModule.forRoot(uri), UsersModule, AuthModule],
    }).compile();

    app = testModule.createNestApplication();
    await app.init();
  });

  afterAll(async () => {
    await mongod.stop();
    await app.close();
  });

  it('should register a new user', async () => {
    return request(app.getHttpServer())
      .post('/auth/national/register')
      .send({ username: 'username', password: 'password' })
      .expect(201);
  });
});
