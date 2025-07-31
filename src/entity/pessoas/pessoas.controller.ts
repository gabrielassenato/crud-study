import { Body, Controller, Delete, Get, Param, Patch, Post } from "@nestjs/common";
import { PessoasService } from "./pessoas.service";
import { CreatePessoasDto } from "./dto/create-pessoas.dto";
import { UpdatePessoasDto } from "./dto/update-pessoas.dto";

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
    create(@Body() createPessoasDto: CreatePessoasDto) {
        return this.pessoasService.create(createPessoasDto);
    }

    @Patch(':id')
    update(@Param('id') id: string, @Body() updatePessoasDto: UpdatePessoasDto) {
        return this.pessoasService.update(id, updatePessoasDto);
    }

    @Delete(':id')
    remove(@Param('id') id: string) {
        return this.pessoasService.remove(id);
    }
}