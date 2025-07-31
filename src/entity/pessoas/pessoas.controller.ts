import { Body, Controller, Delete, Get, Param, Patch, Post } from "@nestjs/common";
import { PessoasService } from "./pessoas.service";

@Controller('pessoas')
export class PessoasController {
    constructor(private readonly pessoasService: PessoasService) {}

    @Get()
    findAll() {
        return this.pessoasService.findAll();
    }

    @Get(':id')
    findOne(@Param('id') id: string) {
        return this.pessoasService.findOne(id);
    }

    @Post()
    create(@Body() body: any) {
        return this.pessoasService.create(body);
    }

    @Patch(':id')
    update(@Param('id') id: string, @Body() body: any) {
        return this.pessoasService.update(id, body);
    }

    @Delete(':id')
    remove(@Param('id') id: string) {
        return this.pessoasService.remove(id);
    }
}