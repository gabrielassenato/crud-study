import { MiddlewareConsumer, Module, NestModule, RequestMethod } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { RecadosModule } from './entity/recados/recados.module';
import { TypeOrmModule } from '@nestjs/typeorm';
import { PessoasModule } from './entity/pessoas/pessoas.module';
import { SimpleMiddleware } from './common/middlewares/simple.middleware';
import { AnotherMiddleware } from './common/middlewares/another.middleware';

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
  }), RecadosModule, PessoasModule],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule implements NestModule {
  // Middleware global
  configure(consumer: MiddlewareConsumer) {
    consumer.apply(SimpleMiddleware /*, AnotherMiddleware*/).forRoutes({
      path: 'recados/*', //decide a rota que o middleware será aplicado
      method: RequestMethod.ALL, //decide o método que o middleware será aplicado
    });
    consumer.apply(AnotherMiddleware).forRoutes({
      path: 'recados/*', //decide a rota que o middleware será aplicado
      method: RequestMethod.ALL, //decide o método que o middleware será aplicado
    });
  }
}
