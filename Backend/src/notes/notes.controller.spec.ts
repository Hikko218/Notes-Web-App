/* eslint-disable @typescript-eslint/no-unsafe-argument */
import { Test } from '@nestjs/testing';
import { INestApplication } from '@nestjs/common';
import * as request from 'supertest';
import { AppModule } from '../app.module';
import { User } from '@prisma/client';
import { Note } from '@prisma/client';
import { PrismaService } from '../prisma/prisma.service';

describe('NotesController', () => {
  let app: INestApplication;
  let user: User;
  let prisma: PrismaService;
  let note: Note;

  beforeEach(async () => {
    const moduleFixture = await Test.createTestingModule({
      imports: [AppModule],
    }).compile();

    app = moduleFixture.createNestApplication();
    await app.init();

    // Create Prisma service
    prisma = moduleFixture.get<PrismaService>(PrismaService);

    // Clean database
    await prisma.note.deleteMany({});
    await prisma.user.deleteMany({});

    // Create user for tests
    user = await prisma.user.create({
      data: {
        username: 'Testuser',
        email: 'test@example.com',
        password: 'secret',
      },
    });

    // Create note for tests
    note = await prisma.note.create({
      data: {
        title: 'Test',
        content: { name: 'Test' },
        deleted: false,
        userId: user.id,
      },
    });
  });

  // Create Note
  it('/notes (POST) should create notes', async () => {
    const data = {
      title: 'Test2',
      content: { name: 'Test2' },
      deleted: false,
      userId: user.id,
    };
    const res = await request(app.getHttpServer()).post(`/notes`).send(data);
    expect(res.status).toBe(201);
    expect(res.body).toEqual({ success: true });
  });

  // Get Note by userId
  it('/notes/:userId (GET) should return notes', async () => {
    const res = await request(app.getHttpServer()).get(
      `/notes/user/${user.id}`,
    );
    const notes = res.body as Note[];
    expect(res.status).toBe(200);
    expect(Array.isArray(res.body)).toBe(true);
    expect(notes.some((n: Note) => n.id === note.id)).toBe(true);
  });

  // Update Note by noteId
  it('/notes/:noteId (PUT) should update note', async () => {
    const data = {
      title: 'Updated',
      content: { name: 'Updated' },
      deleted: false,
      userId: user.id,
    };
    const res = await request(app.getHttpServer())
      .put(`/notes/${note.id}`)
      .send(data);
    expect(res.status).toBe(200);
    expect(res.body).toEqual({ success: true });
  });

  // Get Note by noteId
  it('/notes/:noteId (GET) should return note', async () => {
    const res = await request(app.getHttpServer()).get(`/notes/${note.id}`);
    const noteRes = res.body as Note;
    expect(res.status).toBe(200);
    expect(noteRes.id).toBe(note.id);
  });

  // Soft delete note
  it('/notes/softDelete/:noteId (PUT) should update note', async () => {
    const data = {
      deleted: true,
    };
    const res = await request(app.getHttpServer())
      .put(`/notes/softDelete/${note.id}`)
      .send(data);
    expect(res.status).toBe(200);
    expect(res.body).toEqual({ success: true });
  });

  // Delete note
  it('/notes/:noteId (DELETE) should delete note', async () => {
    await request(app.getHttpServer()).delete(`/notes/${note.id}`);
    const res = await request(app.getHttpServer()).get(`/notes/${note.id}`);
    expect(res.status).toBe(404);
  });

  afterAll(async () => {
    await app.close();
  });
});
