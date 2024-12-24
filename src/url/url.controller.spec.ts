import { Test, TestingModule } from '@nestjs/testing';
import { UrlController } from './url.controller';
import { UrlService } from './url.service';
import { AuthService } from '../auth/auth.service';
import { Request } from 'express';
import { CreateUrlDto } from './dto/create-url.dto';
import { User } from '../user/entities/user.entity';

describe('UrlController', () => {
  let controller: UrlController;
  let service: UrlService;
  let authService: AuthService;

  const mockUrlService = {
    shortenUrl: jest.fn(),
    getUserUrls: jest.fn(),
    updateUrl: jest.fn(),
    deleteUrl: jest.fn(),
    redirectUrl: jest.fn(),
  };

  const mockAuthService = {
    validateUserFromRequest: jest.fn(),
  };

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [UrlController],
      providers: [
        { provide: UrlService, useValue: mockUrlService },
        { provide: AuthService, useValue: mockAuthService },
      ],
    }).compile();

    controller = module.get<UrlController>(UrlController);
    service = module.get<UrlService>(UrlService);
    authService = module.get<AuthService>(AuthService);
  });

  afterEach(() => {
    jest.clearAllMocks();
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });

  describe('shortenUrl', () => {
    it('should shorten a URL for an authenticated user', async () => {
      const createUrlDto: CreateUrlDto = { originalUrl: 'http://example.com' };
      const user = { id: 1 } as User;
      const shortenedUrl = 'http://localhost:3077/urls/abcd12';

      mockAuthService.validateUserFromRequest.mockResolvedValue(user);
      mockUrlService.shortenUrl.mockResolvedValue(shortenedUrl);

      const result = await controller.shortenUrl(createUrlDto, { headers: {} } as Request);
      expect(result).toBe(shortenedUrl);
    });

    it('should shorten a URL for an anonymous user', async () => {
      const createUrlDto: CreateUrlDto = { originalUrl: 'http://example.com' };
      const shortenedUrl = 'http://localhost:3077/urls/abcd12';

      mockAuthService.validateUserFromRequest.mockRejectedValue(new Error('Unauthorized'));
      mockUrlService.shortenUrl.mockResolvedValue(shortenedUrl);

      const result = await controller.shortenUrl(createUrlDto, { headers: {} } as Request);
      expect(result).toBe(shortenedUrl);
    });
  });

  describe('getUserUrls', () => {
    it('should return a list of user URLs', async () => {
      const user = { id: 1 } as User;
      const urls = [
        { id: 1, originalUrl: 'http://example1.com', shortUrl: 'abcd12', userId: 1, clickCount: 0 },
        { id: 2, originalUrl: 'http://example2.com', shortUrl: 'abcd34', userId: 1, clickCount: 0 },
      ];

      mockAuthService.validateUserFromRequest.mockResolvedValue(user);
      mockUrlService.getUserUrls.mockResolvedValue(urls);

      const result = await controller.getUserUrls({ headers: {} } as Request);
      expect(result).toEqual(urls);
    });
  });

  describe('updateUrl', () => {
    it('should update a URL for a user', async () => {
      const id = 1;
      const createUrlDto: CreateUrlDto = { originalUrl: 'http://newexample.com' };
      const user = { id: 1 } as User;
      const updatedUrl = { id, originalUrl: 'http://newexample.com', shortUrl: 'abcd12', userId: 1, clickCount: 0 };

      mockAuthService.validateUserFromRequest.mockResolvedValue(user);
      mockUrlService.updateUrl.mockResolvedValue(updatedUrl);

      const result = await controller.updateUrl(id, { headers: {} } as Request, createUrlDto);
      expect(result).toEqual(updatedUrl);
    });
  });

  describe('deleteUrl', () => {
    it('should delete a URL for a user', async () => {
      const id = 1;
      const user = { id: 1 } as User;

      mockAuthService.validateUserFromRequest.mockResolvedValue(user);
      mockUrlService.deleteUrl.mockResolvedValue(undefined);

      await controller.deleteUrl(id, { headers: {} } as Request);
      expect(mockUrlService.deleteUrl).toHaveBeenCalledWith(id, user.id);
    });
  });
});
