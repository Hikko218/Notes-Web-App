import { Test, TestingModule } from '@nestjs/testing';
import { FolderService } from './folder.service';
import { PrismaService } from '../prisma/prisma.service';
import { execSync } from 'child_process';

beforeAll(() => {
  execSync(
    'npx prisma migrate deploy --schema=prisma/test-migrations/schema.test.prisma',
  );
});

describe('FolderService', () => {
  let service: FolderService;

  // Unit tests for FolderService (folder CRUD operations)
  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [FolderService, PrismaService],
    }).compile();

    service = module.get<FolderService>(FolderService);

    // Clean database
    await service['prisma'].folder.deleteMany({});
    await service['prisma'].note.deleteMany({});
    await service['prisma'].user.deleteMany({});
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });

  it('create, get, update, and delete a folder', async () => {
    // create user first
    const user = await service['prisma'].user.create({
      data: {
        username: 'Testuser',
        email: 'test@example.com',
        password: 'secret',
      },
    });

    // create folder
    const folder = await service.createFolder(user.id, 'Test Folder');
    expect(folder).toBeDefined();
    expect(folder.name).toBe('Test Folder');

    // get folders by user
    const folders = await service.getFoldersByUser(user.id);
    expect(folders).toBeDefined();
    expect(folders.length).toBe(1);
    expect(folders[0].name).toBe('Test Folder');

    // update folder
    const updatedFolder = await service.updateFolder(
      folder.id,
      'Updated Folder',
    );
    expect(updatedFolder).toBeDefined();
    expect(updatedFolder.name).toBe('Updated Folder');

    // delete folder
    await service.deleteFolder(folder.id);

    // get folders after delete
    const foldersAfterDelete = await service.getFoldersByUser(user.id);
    expect(foldersAfterDelete.length).toBe(0);
  });
});
