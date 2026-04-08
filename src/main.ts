import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import { ValidationPipe } from '@nestjs/common';
import helmet from 'helmet';

async function bootstrap() {
  const app = await NestFactory.create(AppModule);
  app.useGlobalPipes(new ValidationPipe({
    whitelist: true, // remove propriedades que não estão no DTO
    forbidNonWhitelisted: true, // retorna erro se receber propriedades que não estão no DTO
    transform: false, // transforma os tipos de dados, por exemplo, string para number
  }));

  if (process.env.NODE_ENV === 'production') {
    // helmet -> cabeçalhos de segurança no protocolo HTTP
    app.use(helmet());

    // cors -> permitir que outro dominio faça requisições para a nossa API
    app.enableCors({
      origin: process.env.CORS_ORIGIN ?? '*', // permitir requisições de qualquer origem
    });
  }

  await app.listen(process.env.PORT ?? 3000);
}
bootstrap();
