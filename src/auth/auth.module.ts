import { Global, Module } from "@nestjs/common";
import { BcryptService } from "./hashing/bcrypt.service";
import { HashingService } from "./hashing/hashing.service";
import { AuthController } from './auth.controller';
import { AuthService } from './auth.service';

@Global()
@Module({
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