import { Controller, Post, Body, Get, Param, Put, Delete, Req, Res, HttpCode, HttpStatus } from '@nestjs/common';
import { Request, Response } from 'express';
import { UrlService } from './url.service';
import { Url } from './entities/url.entity';
import { CreateUrlDto } from './dto/create-url.dto';
import { User } from '../user/entities/user.entity';
import { AuthService } from '../auth/auth.service';

@Controller('urls')
export class UrlController {
  constructor(private readonly urlService: UrlService, private readonly authService: AuthService) {}

  @Post('shorten')
  async shortenUrl(@Body() createUrlDto: CreateUrlDto, @Req() request: Request): Promise<string> {
    let userId: number | null = null

    try {
      const user: User = await this.authService.validateUserFromRequest(request);
      userId = user.id;
    } catch (error) {
      console.log('Usuário não autenticado. URL será anônimo');
    }

    return this.urlService.shortenUrl(createUrlDto.originalUrl, userId);
  }
  
  @Get()
  async getUserUrls(@Req() request: Request): Promise<Url[]> {
    const user: User = await this.authService.validateUserFromRequest(request);
    return this.urlService.getUserUrls(user.id);
  }

  @Put(':id')
  async updateUrl(@Param('id') id: number, 
  @Req() request: Request,
  @Body() createUrlDto: CreateUrlDto): Promise<Url> {
    const user = await this.authService.validateUserFromRequest(request);
    return this.urlService.updateUrl(id, createUrlDto.originalUrl, user.id);
  }

  @Delete(':id')
  @HttpCode(HttpStatus.NO_CONTENT)
  async deleteUrl(@Param('id') id: number, @Req() request: Request): Promise<void> {
    const user = await this.authService.validateUserFromRequest(request);
    await this.urlService.deleteUrl(id, user.id);
  }

  @Get(':shortUrl')
  async redirect(@Param('shortUrl') shortUrl: string, @Res() res: Response): Promise<void> {
    const url = await this.urlService.redirectUrl(shortUrl);
    res.redirect(url.originalUrl);
  }
}
