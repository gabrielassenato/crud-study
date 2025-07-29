import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { RecadosModule } from './entity/recados/recados.module';
import { TypeOrmModule } from '@nestjs/typeorm';

@Module({
  imports: [TypeOrmModule.forRoot({
    type: 'postgres',
    host: 'localhost',
    port: 5432,
    username: 'admin',
    password: 'admin',
    database: 'recados',
    autoLoadEntities: true, // carrega automaticamente as entidades
    synchronize: true, // sincroniza o banco de dados
  }), RecadosModule],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule {}
