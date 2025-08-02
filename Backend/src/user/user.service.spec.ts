import { Test, TestingModule } from '@nestjs/testing';
import { UserService } from './user.service';
import { PrismaService } from '../prisma/prisma.service';
import { execSync } from 'child_process';

beforeAll(() => {
  execSync(
    'npx prisma migrate deploy --schema=prisma/test-migrations/schema.test.prisma',
  );
});

describe('UsersService', () => {
  let service: UserService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [UserService, PrismaService],
    }).compile();

    service = module.get<UserService>(UserService);

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
      username: string;
      email: string;
      password: string;
      id: number;
    } = await service.createUser({
      username: 'Testuser',
      email: `test${Date.now()}@example.com`,
      password: 'secret',
    });
    expect(user).toBeDefined();
    // Explicitly cast the expected object to ensure type safety
    expect(user).toMatchObject({
      username: 'Testuser',
      email: expect.stringMatching(/test\d+@example\.com/) as unknown as string,
    });

    // Retrieve user
    const retrievedUser = await service.getUserbyEmail(user.email);
    expect(retrievedUser).toBeDefined();
    // Validate retrieved user
    expect(retrievedUser).toMatchObject({
      username: 'Testuser',
      email: expect.stringMatching(/test\d+@example\.com/) as unknown as string,
    });

    // Update user
    const updatedUser = await service.updateUser(user.id, {
      username: 'UpdateUser',
    });
    expect(updatedUser).toBeDefined();
    expect(updatedUser).toMatchObject({ username: 'UpdateUser' });

    // Delete user
    await service.deleteUser(user.id);

    // Check if user deleted
    const userAfterDelete = await service.getUserbyEmail(user.email);
    expect(userAfterDelete).toBeNull();
  });
});
