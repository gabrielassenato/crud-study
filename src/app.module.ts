import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { RecadosModule } from './entity/recados/recados.module';
import { TypeOrmModule } from '@nestjs/typeorm';
import { PessoasModule } from './entity/pessoas/pessoas.module';
import { ConfigModule } from '@nestjs/config';
import { AuthModule } from './auth/auth.module';
import { ServeStaticModule } from '@nestjs/serve-static';
import * as path from 'path';
import { ThrottlerGuard, ThrottlerModule } from '@nestjs/throttler';
import { APP_GUARD } from '@nestjs/core';
@Module({
  imports: [
    ThrottlerModule.forRoot({
      throttlers: [
        {
          ttl: 60000, // time to live em ms
          limit: 60, // maximo de requisições por ttl
          blockDuration: 5000, // tempo que o cliente fica bloqueado após atingir o limite de requisições
        },
      ],
    }),
    ConfigModule.forRoot({
      envFilePath: '.env',
    }),
    TypeOrmModule.forRoot({
      type: process.env.DB_TYPE as any,
      host: process.env.DB_HOST,
      port: Number(process.env.DB_PORT),
      username: process.env.DB_USERNAME,
      password: process.env.DB_PASSWORD,
      database: process.env.DB_DATABASE,
      autoLoadEntities: Boolean(process.env.DB_AUTOLOADENTITIES), // carrega todas as entidades 
      synchronize: Boolean(process.env.DB_SYNCHRONIZE),
    }),
    ServeStaticModule.forRoot({
      rootPath: path.resolve(__dirname, '..', 'pictures'),
      serveRoot: '/pictures'
    }),
    RecadosModule,
    PessoasModule,
    AuthModule,
  ],
  controllers: [AppController],
  providers: [AppService, 
    {
    provide: APP_GUARD,
    useClass: ThrottlerGuard
    }
  ],
})
export class AppModule {
  constructor() {}
}
