import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import { ValidationPipe } from '@nestjs/common';

async function bootstrap() {
  const app = await NestFactory.create(AppModule);
  app.useGlobalPipes(new ValidationPipe({
    whitelist: true, // remove propriedades que não estão no DTO
    forbidNonWhitelisted: true, // retorna erro se receber propriedades que não estão no DTO
  }));
  await app.listen(process.env.PORT ?? 3000);
}
bootstrap();
