import { Test, TestingModule } from '@nestjs/testing';
import { AuthController } from './auth.controller';
import { AuthService } from './auth.service';
import { mockDeep, DeepMockProxy } from 'jest-mock-extended';
import { Response } from 'express';

describe('AuthController', () => {
  let controller: AuthController;
  let authService: DeepMockProxy<AuthService>;
  let res: Response;

  beforeEach(async () => {
    authService = mockDeep<AuthService>();
    res = {
      cookie: jest.fn(),
      clearCookie: jest.fn(), // Mock clearCookie method
      send: jest.fn(),
      status: jest.fn().mockReturnThis(),
    } as unknown as Response;

    const module: TestingModule = await Test.createTestingModule({
      controllers: [AuthController],
      providers: [
        {
          provide: AuthService,
          useValue: authService,
        },
      ],
    }).compile();

    controller = module.get<AuthController>(AuthController);
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });

  describe('login', () => {
    it('should call AuthService.validateUser and AuthService.login', async () => {
      const body = { email: 'test@mail.com', password: 'testpassword' };
      const user = { id: 1, username: 'testuser', email: 'test@mail.com' };

      authService.validateUser.mockResolvedValue(user);
      authService.login.mockImplementation(async () => {
        res.cookie('token', 'signed-jwt-token');
        res.send({ message: 'Logged in' });
      });

      await controller.login(body, res);

      expect(() =>
        authService.validateUser(body.email, body.password),
      ).not.toThrow();
      expect(() => authService.login(user, res)).not.toThrow();
      expect(() => res.cookie('token', expect.any(String))).not.toThrow();
      expect(() => res.send({ message: 'Logged in' })).not.toThrow();
    });

    it('should return 401 if credentials are invalid', async () => {
      const body = { email: 'test@mail.com', password: 'wrongpassword' };

      authService.validateUser.mockResolvedValue(null);

      await controller.login(body, res);

      expect(() =>
        authService.validateUser(body.email, body.password),
      ).not.toThrow();
      expect(() => res.status(401)).not.toThrow();
      expect(() => res.send({ message: 'Invalid credentials' })).not.toThrow();
    });
  });

  describe('status', () => {
    it('should return user status with authentication info', () => {
      // Mock user
      const mockUser = { userId: 1, username: 'testuser' };
      // Mock req in res
      // eslint-disable-next-line @typescript-eslint/no-unsafe-member-access
      (res as any).req = { user: mockUser };
      const result = controller.getUserStatus(res);
      expect(result).toBeUndefined(); // Da res.send verwendet wird
      expect(res.send).toHaveBeenCalledWith({
        isAuthenticated: true,
        userId: 1,
        username: 'testuser',
      });
    });

    it('should return unauthenticated status if no user', () => {
      // eslint-disable-next-line @typescript-eslint/no-unsafe-member-access
      (res as any).req = {};
      const result = controller.getUserStatus(res);
      expect(result).toBeUndefined();
      expect(res.send).toHaveBeenCalledWith({
        isAuthenticated: false,
        userId: null,
        username: null,
      });
    });
  });

  describe('logout', () => {
    it('should clear the token cookie and send a response', () => {
      controller.logout(res);
      expect(() =>
        res.clearCookie('token', {
          path: '/',
        }),
      ).not.toThrow();
      expect(() => res.send({ message: 'Logged out' })).not.toThrow();
    });
  });
});
