/* eslint-disable @typescript-eslint/no-unsafe-argument */
import { INestApplication } from '@nestjs/common';
import { Test } from '@nestjs/testing';
import * as request from 'supertest';
import { AppModule } from '../app.module';
import { User } from '@prisma/client';
import { Folder } from '@prisma/client';
import { PrismaService } from '../prisma/prisma.service';

describe('FolderController', () => {
  // Unit tests for FolderController (folder routes)
  let app: INestApplication;
  let user: User;
  let prisma: PrismaService;
  let folder: Folder;

  beforeEach(async () => {
    const moduleFixture = await Test.createTestingModule({
      imports: [AppModule],
    }).compile();

    app = moduleFixture.createNestApplication();
    await app.init();

    // Create Prisma service
    prisma = moduleFixture.get<PrismaService>(PrismaService);

    // Clean database
    await prisma.folder.deleteMany({});
    await prisma.user.deleteMany({});

    // Create user for tests
    user = await prisma.user.create({
      data: {
        username: 'Testuser',
        email: 'test@example.com',
        password: 'secret',
      },
    });

    // Create folder for tests
    folder = await prisma.folder.create({
      data: {
        name: 'Test Folder',
        userId: user.id,
      },
    });
  });

  // Create Folder
  it('/folder (POST) should create folder', async () => {
    const data = {
      name: 'New Folder',
      userId: user.id,
    };
    const res = await request(app.getHttpServer()).post(`/folder`).send(data);
    expect(res.status).toBe(201);
    expect(res.body).toEqual({ success: true });
  });

  // Get Folders by userId
  it('/folder/user/:userId (GET) should return folders', async () => {
    const res = await request(app.getHttpServer()).get(
      `/folder/user/${user.id}`,
    );
    const folders = res.body as Folder[];
    expect(res.status).toBe(200);
    expect(Array.isArray(res.body)).toBe(true);
    expect(folders.some((f: Folder) => f.id === folder.id)).toBe(true);
  });

  // Update Folder by folderId
  it('/folder/:folderId (PUT) should update folder', async () => {
    const data = {
      name: 'Updated Folder',
    };
    const res = await request(app.getHttpServer())
      .put(`/folder/${folder.id}`)
      .send(data);
    expect(res.status).toBe(200);
    expect(res.body).toEqual({ success: true });
  });

  // Delete Folder
  it('/folder/:folderId (DELETE) should delete folder', async () => {
    await request(app.getHttpServer()).delete(`/folder/${folder.id}`);
    const res = await request(app.getHttpServer()).get(
      `/folder/user/${user.id}`,
    );
    const folders = res.body as Folder[];
    expect(res.status).toBe(200);
    expect(folders.some((f: Folder) => f.id === folder.id)).toBe(false);
  });

  afterAll(async () => {
    await app.close();
  });
});
