import { Test, TestingModule } from '@nestjs/testing';
import { UsersService } from './users.service';
import { PrismaService } from '../prisma/prisma.service';
import { execSync } from 'child_process';

beforeAll(() => {
  execSync(
    'npx prisma migrate deploy --schema=prisma/test-migrations/schema.test.prisma',
  );
});

describe('UsersService', () => {
  let service: UsersService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [UsersService, PrismaService],
    }).compile();

    service = module.get<UsersService>(UsersService);

    // Clean database
    await service['prisma'].note.deleteMany({});
    await service['prisma'].user.deleteMany({});
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });

  it('create, retrieve, delete, and update a user', async () => {
    // Create user
    const user: {
      name: string;
      email: string;
      password: string;
      id: number;
    } = await service.createUser({
      name: 'Testuser',
      email: `test${Date.now()}@example.com`,
      password: 'secret',
    });
    expect(user).toBeDefined();
    // Explicitly cast the expected object to ensure type safety
    expect(user).toMatchObject({
      name: 'Testuser',
      email: expect.stringMatching(/test\d+@example\.com/) as unknown as string,
    });

    // Retrieve user
    const retrievedUser = await service.getUserbyId(user.id);
    expect(retrievedUser).toBeDefined();
    // Validate retrieved user
    expect(retrievedUser).toMatchObject({
      name: 'Testuser',
      email: expect.stringMatching(/test\d+@example\.com/) as unknown as string,
    });

    // Update user
    const updatedUser = await service.updateUser(user.id, {
      name: 'UpdateUser',
    });
    expect(updatedUser).toBeDefined();
    expect(updatedUser).toMatchObject({ name: 'UpdateUser' });

    // Delete user
    await service.deleteUser(user.id);

    // Check if user deleted
    const userAfterDelete = await service.getUserbyId(user.id);
    expect(userAfterDelete).toBeNull();
  });
});
