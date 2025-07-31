import { Module } from "@nestjs/common";
import { PessoasController } from "./pessoas.controller";
import { PessoasService } from "./pessoas.service";

@Module({
    imports: [],
    controllers: [PessoasController],
    providers: [PessoasService],
})
export class PessoasModule {}