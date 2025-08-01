import { Module } from "@nestjs/common";
import { PessoasController } from "./pessoas.controller";
import { PessoasService } from "./pessoas.service";
import { TypeOrmModule } from "@nestjs/typeorm";
import { Pessoa } from "./entities/pessoa.entity";

@Module({
    imports: [TypeOrmModule.forFeature([Pessoa])],
    controllers: [PessoasController],
    providers: [PessoasService],
    exports: [PessoasService],
})
export class PessoasModule {}