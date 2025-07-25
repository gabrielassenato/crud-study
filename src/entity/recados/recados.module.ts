import { Module } from "@nestjs/common";
import { RecadosController } from "./recados.controller";
import { RecadosService } from "./recados.service";

@Module({
    imports: [],
    controllers: [RecadosController],
    providers: [RecadosService],
})
export class RecadosModule {}