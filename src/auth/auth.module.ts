import { Global, Module } from "@nestjs/common";
import { BcryptService } from "./hashing/bcrypt.service";
import { HashingService } from "./hashing/hashing.service";
import { AuthController } from './auth.controller';
import { AuthService } from './auth.service';
import { TypeOrmModule } from "@nestjs/typeorm";
import { Pessoa } from "src/entity/pessoas/entities/pessoa.entity";
import { ConfigModule } from "@nestjs/config";
import jwtConfig from "./config/jwt.config";

@Global()
@Module({
    imports: [TypeOrmModule.forFeature([Pessoa]), ConfigModule.forFeature(jwtConfig)],
    providers: [
        {
            provide: HashingService,
            useClass: BcryptService,
        },
        AuthService,
    ],
    exports: [HashingService],
    controllers: [AuthController],
})
export class AuthModule {}