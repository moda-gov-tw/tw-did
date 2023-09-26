import { INestApplication } from '@nestjs/common';
import request from 'supertest';
import { MongoMemoryServer } from 'mongodb-memory-server';
import { setupMongoDb, setupTestApplication } from '../../tests/helper';

describe('NationalModule', () => {
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

  it('should register a new user', async () => {
    const server = app.getHttpServer();
    const res = await request(server)
      .post('/api/auth/national/register')
      .send({ username: 'username', password: 'password' })
      .expect(201);

    return request(server)
      .get(`/api/users/${res.body.id}`)
      .set('Authorization', `Bearer ${res.body.token}`)
      .expect(200);
  });

  it('should login an existing user', async () => {
    const server = app.getHttpServer();

    await request(server)
      .post('/api/auth/national/register')
      .send({ username: 'username', password: 'password' });

    await request(server)
      .post('/api/auth/national/login')
      .send({ username: 'username', password: 'password' })
      .expect(201)
      .expect((res) => {
        expect(res.body).toHaveProperty('token');
      });
  });

  it('should check an existing user', async () => {
    const server = app.getHttpServer();
    const res = await request(server)
      .post('/api/auth/national/register')
      .send({ username: 'username', password: 'password' });

    await request(server)
      .get('/api/auth/national/check')
      .set('Authorization', `Bearer ${res.body.token}`)
      .expect(200)
      .expect((res) => {
        expect(res.body).toHaveProperty('user');
      });
  });

  it('should fail to login with incorrect username', async () => {
    const server = app.getHttpServer();

    await request(server)
      .post('/api/auth/national/login')
      .send({ username: 'non-exist', password: 'password' })
      .expect(401);
  });

  it('should fail to register with existing username', async () => {
    const server = app.getHttpServer();
    await request(server)
      .post('/api/auth/national/register')
      .send({ username: 'username', password: 'password' });
    return request(server)
      .post('/api/auth/national/register')
      .send({ username: 'username', password: 'password' })
      .expect(409);
  });

  it('should fail to check without a JWT token', async () => {
    return request(app.getHttpServer())
      .get('/api/auth/national/check')
      .expect(401);
  });
});
