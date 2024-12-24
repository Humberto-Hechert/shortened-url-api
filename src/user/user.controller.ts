import { Controller, Get, Post, Put, Delete, Body, Param, ParseIntPipe } from '@nestjs/common';
import { UserService } from './user.service';
import { ApiOperation, ApiResponse, ApiTags, ApiBody, ApiParam } from '@nestjs/swagger';

@Controller('users')
export class UserController {
  constructor(private readonly userService: UserService) {}

  @Post()
  @ApiOperation({ summary: 'Cria um novo usuário' })
  @ApiBody({
    description: "Email e senha para criar um novo usuário",
    type: Object,
    examples: {
      'application/json': {
        value: {
          email: 'user@teste.com',
          password: 'senha@123'
        }
      }
    }
  })
  @ApiResponse({
    status: 201,
    description: 'Usuário criado com sucesso',
  })
  @ApiResponse({
    status: 400,
    description: 'Usuário ou senha inválidos',
  })
  create(@Body('email') email: string, @Body('password') password: string) {
    return this.userService.create(email, password);
  }

  @Get()
  @ApiOperation({ summary: 'Retorna todos os usuários' })
  @ApiResponse({
    status: 200,
    description: 'Lista de usuários',
    type: [Object], 
  })
  @ApiResponse({
    status: 404,
    description: 'Usuários não encontrados',
  })
  findAll() {
    return this.userService.findAll();
  }

  @Get(':id')
  @ApiOperation({ summary: 'Retorna usuário pelo ID' })
  @ApiParam({
    name: 'id',
    description: 'ID do usuário a ser retornado',
    example: 1,
  })
  @ApiResponse({
    status: 200,
    description: 'Usuário encontrado',
    type: Object,
  })
  @ApiResponse({
    status: 404,
    description: 'Usuário não encontrado',
  })
  findOne(@Param('id', ParseIntPipe) id: number) {
    return this.userService.findOne(id);
  }

  @Post('findMail')
  async findByEmail(@Body('email') email: string) {
    return this.userService.findByEmail(email);
  }

  @Put(':id')
  @ApiOperation({ summary: 'Atualiza dados do usuário' })
  @ApiParam({
    name: 'id',
    description: 'ID do usuário a ser atualizado',
    example: 1,
  })
  @ApiBody({
    description: 'Dados do usuário a ser atualizado',
    type: Object,
    examples: {
      'application/json': {
        value: {
          email: 'novoemail@teste.com',
          password: 'novasenha@123'
        }
      }
    }
  })
  @ApiResponse({
    status: 200,
    description: 'Usuário atualizado com sucesso',
    type: Object,
  })
  @ApiResponse({
    status: 404,
    description: 'Usuário não encontrado',
  })
  update(
    @Param('id', ParseIntPipe) id: number,
    @Body('email') email: string,
    @Body('password') password: string,
  ) {
    return this.userService.update(id, email, password);
  }

  @Delete(':id')
  @ApiOperation({ summary: 'Deleta um usuário pelo ID' })
  @ApiParam({
    name: 'id',
    description: 'ID do usuário a ser deletado',
    example: 1,
  })
  @ApiResponse({
    status: 204,
    description: 'Usuário deletado com sucesso',
  })
  @ApiResponse({
    status: 404,
    description: 'Usuário não encontrado',
  })
  delete(@Param('id', ParseIntPipe) id: number) {
    return this.userService.delete(id);
  }
}
