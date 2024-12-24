import { Test, TestingModule } from '@nestjs/testing';
import { AuthController } from './auth.controller';
import { AuthService } from './auth.service';
import { UnauthorizedException } from '@nestjs/common';

describe('AuthController', () => {
  let controller: AuthController;
  let service: AuthService;

  const mockAuthService = {
    validateUser: jest.fn(),
    login: jest.fn(),
  };

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [AuthController],
      providers: [
        { provide: AuthService, useValue: mockAuthService },
      ],
    }).compile();

    controller = module.get<AuthController>(AuthController);
    service = module.get<AuthService>(AuthService);
  });

  afterEach(() => {
    jest.clearAllMocks();
  });

  describe('login', () => {
    it('should return an access token when credentials are valid', async () => {
      const email = 'user@example.com';
      const password = 'password123';
      const user = { id: 1, email };
      const accessToken = 'someAccessToken';

      mockAuthService.validateUser.mockResolvedValue(user);
      mockAuthService.login.mockResolvedValue({ access_token: accessToken });

      const result = await controller.login({ email, password });
      expect(result).toEqual({ access_token: accessToken });
      expect(mockAuthService.validateUser).toHaveBeenCalledWith(email, password);
      expect(mockAuthService.login).toHaveBeenCalledWith(user);
    });

    it('should throw UnauthorizedException if credentials are invalid', async () => {
      const email = 'user@example.com';
      const password = 'wrongpassword';

      mockAuthService.validateUser.mockRejectedValue(new UnauthorizedException('Invalid credentials'));

      await expect(controller.login({ email, password })).rejects.toThrow(UnauthorizedException);
    });
  });
});
