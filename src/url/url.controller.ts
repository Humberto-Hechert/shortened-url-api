import { Controller, Post, Body, Get, Param, Put, Delete, Req, Res, HttpCode, HttpStatus } from '@nestjs/common';
import { Request, Response } from 'express';
import { UrlService } from './url.service';
import { Url } from './entities/url.entity';
import { CreateUrlDto } from './dto/create-url.dto';
import { User } from '../user/entities/user.entity';
import { AuthService } from '../auth/auth.service';
import { ApiOperation, ApiResponse, ApiTags, ApiBody, ApiParam } from '@nestjs/swagger';

@Controller('urls')
@ApiTags('URLs') // Define a tag para os endpoints relacionados a URLs
export class UrlController {
  constructor(private readonly urlService: UrlService, private readonly authService: AuthService) {}

  @Post('shorten')
  @ApiOperation({ summary: 'Encurta uma URL' })
  @ApiBody({
    description: 'URL original a ser encurtada',
    type: CreateUrlDto,
    examples: {
      'appplication/json': {
        value: {
          originalUrl: 'https://exemplo.com'
        }
      }
    }
  })
  @ApiResponse({
    status: 201,
    description: 'URL original foi encurtada com sucesso',
    schema: {
      example: 'httpl://localhost:3077/urls/abc123'
    }
  })
  @ApiResponse({
    status: 401,
    description: 'Não autorizado',
  })
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
  @ApiOperation({ summary: 'Lista todas as URLs' })
  @ApiResponse({
    status: 200,
    description: 'Listou URLs',
    type: [Url],
  })
  @ApiResponse({
    status: 401,
    description: 'Não autorizado',
  })
  async getUserUrls(@Req() request: Request): Promise<Url[]> {
    const user: User = await this.authService.validateUserFromRequest(request);
    return this.urlService.getUserUrls(user.id);
  }

  @Put(':id')
  @ApiOperation({ summary: 'Atualiza uma URL existente' })
  @ApiParam({
    name: 'id',
    description: 'ID da URL a ser atualizada',
    example: 1,
  })
  @ApiBody({
    description: 'Atualiza URL original',
    type: CreateUrlDto,
    examples: {
      'application/json': {
        value: {
          originalUrl: 'http://url-nova.com'
        }
      }
    }
  })
  @ApiResponse({
    status: 200,
    description: 'URL Atualizada com sucesso',
    type: Url,
  })
  @ApiResponse({
    status: 404,
    description: 'URL não encontrada',
  })
  async updateUrl(@Param('id') id: number, 
  @Req() request: Request,
  @Body() createUrlDto: CreateUrlDto): Promise<Url> {
    const user = await this.authService.validateUserFromRequest(request);
    return this.urlService.updateUrl(id, createUrlDto.originalUrl, user.id);
  }

  @Delete(':id')
  @ApiOperation({ summary: 'Deleta uma URL' })
  @ApiParam({
    name: 'id',
    description: 'ID da URL a ser deletado',
    example: 1,
  })
  @ApiResponse({
    status: 204,
    description: 'URL deletada com sucesso',
  })
  @ApiResponse({
    status: 404,
    description: 'URL não encontrada',
  })
  @HttpCode(HttpStatus.NO_CONTENT)
  async deleteUrl(@Param('id') id: number, @Req() request: Request): Promise<void> {
    const user = await this.authService.validateUserFromRequest(request);
    await this.urlService.deleteUrl(id, user.id);
  }

  @Get(':shortUrl')
  @ApiOperation({ summary: 'Redireciona para a URL original a partir da URL encurtada' })
  @ApiParam({
    name: 'shortUrl',
    description: 'URL encurtada',
    example: 'abc123',
  })
  @ApiResponse({
    status: 302,
    description: 'Redireciona para URL original',
  })
  @ApiResponse({
    status: 404,
    description: 'URL encurtada não encontrada',
  })
  async redirect(@Param('shortUrl') shortUrl: string, @Res() res: Response): Promise<void> {
    const url = await this.urlService.redirectUrl(shortUrl);
    res.redirect(url.originalUrl);
  }
}
