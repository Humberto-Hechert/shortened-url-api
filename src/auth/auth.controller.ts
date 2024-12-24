import { Controller, Post, Body } from '@nestjs/common';
import { AuthService } from './auth.service';
import { ApiOperation, ApiResponse, ApiTags, ApiBody } from '@nestjs/swagger' ;

@Controller('auth')
@ApiTags('Auth') // Adiciona a tag 'Auth' para organizar os endpoints
export class AuthController {
  constructor(private authService: AuthService) {}

  @Post('login')
  @ApiOperation({ summary: 'Login de autenticação com email e senha do usuário' }) // Descrição da operação
  @ApiBody({
    description: 'Credenciais do Usuário', //Descrição do corpo da requisição
    type: Object,
    examples: {
      'applications/json': {
        value: {
          email: 'user@teste.com',
          password: 'senha@123'
        }
      }
    }
  })
  @ApiResponse({
    status: 200,
    description: 'Retorna o token de acesso caso as credenciais sejam válidas',
    schema: {
      example: { access_token: 'kelndklasnfjndlçakdnfjdsabfwuiw4ibbdakbdksa' }
    }
  })
  @ApiResponse({
    status: 401,
    description: 'Credenciais inválidas'
  })
  async login(@Body() body: { email: string; password: string }) {
    return this.authService.validateUser(body.email, body.password)
      .then(user => this.authService.login(user));
  }
}
