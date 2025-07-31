import { Test, TestingModule } from '@nestjs/testing';
import { NotesService } from './notes.service';
import { PrismaService } from '../prisma/prisma.service';
import { execSync } from 'child_process';

beforeAll(() => {
  execSync(
    'npx prisma migrate deploy --schema=prisma/test-migrations/schema.test.prisma',
  );
});

describe('NotesService', () => {
  let service: NotesService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [NotesService, PrismaService],
    }).compile();

    service = module.get<NotesService>(NotesService);

    // Clean database
    await service['prisma'].note.deleteMany({});
    await service['prisma'].user.deleteMany({});
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });

  it('create, get,delete, and update a note', async () => {
    // create user first
    const user = await service['prisma'].user.create({
      data: {
        name: 'Testuser',
        email: 'test@example.com',
        password: 'secret',
      },
    });

    // create note
    const note = await service.createNote({
      title: 'Test',
      content: { text: 'Hello' },
      deleted: false,
      userId: user.id,
    });
    expect(note).toBeDefined();
    expect(note.title).toBe('Test');
    // get allNotes
    const allNotes = await service.getAllNotes(1);
    expect(allNotes).toBeDefined();
    // soft delete note
    const softDelete = await service.softDeleteNote(note.id, true);
    expect(softDelete).toMatchObject({ deleted: true });
    // update note
    const updatedNotes = await service.updateNote(note.id, {
      title: 'Test 2',
      content: { text: 'Test 2' },
      deleted: false,
    });
    expect(updatedNotes).toMatchObject({
      title: 'Test 2',
      content: { text: 'Test 2' },
      deleted: false,
    });
    // delete note
    await service.deleteNote(note.id);

    // get note for user id
    const noteAfterDelete = await service.getNoteById(note.id);
    expect(noteAfterDelete).toBeNull();
  });
});
