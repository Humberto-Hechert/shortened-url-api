import { Test, TestingModule } from '@nestjs/testing';
import { UrlService } from './url.service';
import { getRepositoryToken } from '@nestjs/typeorm';
import { Url } from './entities/url.entity';
import { Repository } from 'typeorm';
import { ConflictException } from '@nestjs/common';

describe('UrlService', () => {
  let service: UrlService;
  let repository: Repository<Url>;

  const mockUrlRepository = {
    findOne: jest.fn(),
    find: jest.fn(),
    save: jest.fn(),
    create: jest.fn(),
  };

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        UrlService,
        {
          provide: getRepositoryToken(Url),
          useValue: mockUrlRepository,
        },
      ],
    }).compile();

    service = module.get<UrlService>(UrlService);
    repository = module.get<Repository<Url>>(getRepositoryToken(Url));
  });

  afterEach(() => {
    jest.clearAllMocks();
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });

  describe('shortenUrl', () => {
    it('should create a new shortened URL', async () => {
      const originalUrl = 'http://example.com';
      const userId = 1;
      const shortUrlCode = 'abcd12';

      const newUrl = { id: 1, originalUrl, shortUrl: shortUrlCode, userId, clickCount: 0 };
      mockUrlRepository.create.mockReturnValue(newUrl);
      mockUrlRepository.save.mockResolvedValue(newUrl);

      const result = await service.shortenUrl(originalUrl, userId);
      expect(result).toBe(`http://localhost:3077/urls/${shortUrlCode}`);
      expect(mockUrlRepository.create).toHaveBeenCalledWith({
        originalUrl,
        shortUrl: shortUrlCode,
        userId,
      });
      expect(mockUrlRepository.save).toHaveBeenCalledWith(newUrl);
    });

    it('should throw ConflictException if short URL already exists', async () => {
      const originalUrl = 'http://example.com';
      const userId = 1;
      const shortUrlCode = 'abcd12';

      mockUrlRepository.findOne.mockResolvedValueOnce({ shortUrl: shortUrlCode });

      await expect(service.shortenUrl(originalUrl, userId)).rejects.toThrow(ConflictException);
    });
  });

  describe('getUserUrls', () => {
    it('should return a list of URLs for a given user', async () => {
      const userId = 1;
      const urls = [
        { id: 1, originalUrl: 'http://example1.com', shortUrl: 'abcd12', userId, clickCount: 0 },
        { id: 2, originalUrl: 'http://example2.com', shortUrl: 'abcd34', userId, clickCount: 0 },
      ];

      mockUrlRepository.find.mockResolvedValue(urls);

      const result = await service.getUserUrls(userId);
      expect(result).toEqual(urls);
      expect(mockUrlRepository.find).toHaveBeenCalledWith({
        where: { userId, deletedAt: null },
        order: { createdAt: 'DESC' },
      });
    });
  });

  describe('updateUrl', () => {
    it('should update the original URL of an existing URL', async () => {
      const urlId = 1;
      const newOriginalUrl = 'http://newexample.com';
      const userId = 1;

      const url = { id: urlId, originalUrl: 'http://example.com', shortUrl: 'abcd12', userId, clickCount: 0 };

      mockUrlRepository.findOne.mockResolvedValue(url);
      mockUrlRepository.save.mockResolvedValue({ ...url, originalUrl: newOriginalUrl });

      const result = await service.updateUrl(urlId, newOriginalUrl, userId);
      expect(result.originalUrl).toBe(newOriginalUrl);
      expect(mockUrlRepository.findOne).toHaveBeenCalledWith({ where: { id: urlId, userId, deletedAt: null } });
      expect(mockUrlRepository.save).toHaveBeenCalledWith({ ...url, originalUrl: newOriginalUrl });
    });

    it('should throw an error if URL is not found', async () => {
      const urlId = 1;
      const newOriginalUrl = 'http://newexample.com';
      const userId = 1;

      mockUrlRepository.findOne.mockResolvedValue(null);

      await expect(service.updateUrl(urlId, newOriginalUrl, userId)).rejects.toThrowError('URL not found or already deleted');
    });
  });

  describe('deleteUrl', () => {
    it('should mark a URL as deleted', async () => {
      const urlId = 1;
      const userId = 1;

      const url = { id: urlId, originalUrl: 'http://example.com', shortUrl: 'abcd12', userId, clickCount: 0, deletedAt: null };

      mockUrlRepository.findOne.mockResolvedValue(url);
      mockUrlRepository.save.mockResolvedValue({ ...url, deletedAt: new Date() });

      await service.deleteUrl(urlId, userId);
      expect(mockUrlRepository.findOne).toHaveBeenCalledWith({ where: { id: urlId, userId, deletedAt: null } });
      expect(mockUrlRepository.save).toHaveBeenCalledWith({ ...url, deletedAt: expect.any(Date) });
    });

    it('should throw an error if URL is not found', async () => {
      const urlId = 1;
      const userId = 1;

      mockUrlRepository.findOne.mockResolvedValue(null);

      await expect(service.deleteUrl(urlId, userId)).rejects.toThrowError('URL not found or already deleted');
    });
  });
});
