import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import { DocumentBuilder, SwaggerModule } from '@nestjs/swagger';
import * as dotenv from 'dotenv';
dotenv.config();


async function bootstrap() {
  const app = await NestFactory.create(AppModule);
    // Configuração do Swagger
    const config = new DocumentBuilder()
    .setTitle('Shortener URL API') // Título da API
    .setDescription('API REST que encurta URLs') // Descrição da API
    .setVersion('1.0') // Versão da API
    .build();
  const document = SwaggerModule.createDocument(app, config);
  SwaggerModule.setup('api', app, document); // Endpoint onde a documentação será acessada
  await app.listen(process.env.PORT ?? 3077);
}
bootstrap();
