import { Body, Controller, Post } from "@nestjs/common";
import { PessoasService } from "./pessoas.service";

@Controller('pessoas')
export class PessoasController {
    constructor(private readonly pessoasService: PessoasService) {}

    @Post()
    create(@Body() body: any) {
        console.log(body);
        return "teste";
    }
}