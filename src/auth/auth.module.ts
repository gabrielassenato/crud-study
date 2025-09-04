import { Global, Module } from "@nestjs/common";
import { BcryptService } from "./hashing/bcrypt.service";
import { HashingService } from "./hashing/hashing.service";

@Global()
@Module({
    providers: [
        {
            provide: HashingService,
            useClass: BcryptService,
        },
    ],
})
export class AuthModule {}