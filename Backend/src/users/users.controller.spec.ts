/* eslint-disable @typescript-eslint/no-unsafe-argument */
import { Test } from '@nestjs/testing';
import { INestApplication } from '@nestjs/common';
import * as request from 'supertest';
import { AppModule } from '../app.module';
import { PrismaService } from '../prisma/prisma.service';
import { User } from '@prisma/client';

describe('UsersController', () => {
  let app: INestApplication;
  let prisma: PrismaService;
  let user: User;

  beforeEach(async () => {
    const moduleFixture = await Test.createTestingModule({
      imports: [AppModule],
    }).compile();

    app = moduleFixture.createNestApplication();
    await app.init();

    prisma = moduleFixture.get<PrismaService>(PrismaService);

    // Clean database
    await prisma.note.deleteMany({});
    await prisma.user.deleteMany({});

    // Create a user for tests
    user = await prisma.user.create({
      data: {
        name: 'Testuser',
        email: `test${Date.now()}@example.com`, // Dynamic email to avoid unique constraint violations
        password: 'secret',
      },
    });
  });

  it('/users/:id (GET) should return a user', async () => {
    const res = await request(app.getHttpServer()).get(`/users/${user.id}`);
    expect(res.status).toBe(200);
    expect(res.body).toMatchObject({
      id: user.id,
      name: 'Testuser',
      email: expect.stringMatching(/test\d+@example\.com/) as unknown as string,
    });
  });

  it('/users (POST) should create a user', async () => {
    const data = {
      name: 'New User',
      email: `user${Date.now()}@example.com`,
      password: 'newpassword',
    };
    const res = await request(app.getHttpServer()).post('/users').send(data);
    expect(res.status).toBe(201);
    expect(res.body).toMatchObject({
      name: 'New User',
      email: expect.stringMatching(/user\d+@example\.com/) as unknown as string,
    });
  });

  it('/users/:id (PUT) should update a user', async () => {
    const data = {
      name: 'Updated User',
    };
    const res = await request(app.getHttpServer())
      .put(`/users/${user.id}`)
      .send(data);
    expect(res.status).toBe(200);
    expect(res.body).toMatchObject({
      id: user.id,
      name: 'Updated User',
    });
  });

  it('/users/:id (DELETE) should delete a user', async () => {
    const res = await request(app.getHttpServer()).delete(`/users/${user.id}`);
    expect(res.status).toBe(200);
    expect(res.body).toEqual({ success: true });

    const deletedUser = await prisma.user.findUnique({
      where: { id: user.id },
    });
    expect(deletedUser).toBeNull();
  });

  afterAll(async () => {
    await app.close();
  });
});
