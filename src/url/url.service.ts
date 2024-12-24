import { Injectable, Inject, ConflictException } from '@nestjs/common';
import { Repository } from 'typeorm';
import { Url } from './entities/url.entity';
import * as crypto from 'crypto';

@Injectable()
export class UrlService {
  constructor(
    @Inject('SHORTENEDURL_REPOSITORY')
    private urlRepository: Repository<Url>,
  ) {}

  private generateShortCode(): string {
    return crypto.randomBytes(3).toString('base64').slice(0, 6);
  }

  async shortenUrl(originalUrl: string, userId: number | null = null): Promise<string> {
    const shortUrlCode = this.generateShortCode();
    const existingUrl = await this.urlRepository.findOne({ where: { shortUrl: shortUrlCode } });
    if (existingUrl) {
      throw new ConflictException('Short URL already exists');
    }

    const newUrl = this.urlRepository.create({
      originalUrl,
      shortUrl: shortUrlCode,
      userId,
    });

    await this.urlRepository.save(newUrl);
    const baseUrl = 'http://localhost:3077/urls';

    return `${baseUrl}/${shortUrlCode}`;
  }

  async getUserUrls(userId: number): Promise<Url[]> {
    return this.urlRepository.find({
      where: { userId, deletedAt: null },
      order: { createdAt: 'DESC' },
    });
  }

  async updateUrl(id: number, newOriginalUrl: string, userId: number): Promise<Url> {
    const url = await this.urlRepository.findOne({ where: { id, userId, deletedAt: null } });
    if (!url) {
      throw new Error('URL not found or already deleted');
    }

    url.originalUrl = newOriginalUrl;
    return this.urlRepository.save(url);
  }

  async deleteUrl(id: number, userId: number): Promise<void> {
    const url = await this.urlRepository.findOne({ where: { id, userId, deletedAt: null } });
    if (!url) {
      throw new Error('URL not found or already deleted');
    }

    url.deletedAt = new Date();
    await this.urlRepository.save(url);
  }

  async redirectUrl(shortUrl: string): Promise<Url> {
    const url = await this.urlRepository.findOne({ where: { shortUrl, deletedAt: null } });
    if (!url) {
      throw new Error('Short URL not found or already deleted');
    }

    url.clickCount++;
    await this.urlRepository.save(url);

    return url;
  }
}
