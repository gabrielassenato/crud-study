import { Body, Controller, Delete, Get, Param, ParseIntPipe, Patch, Post } from "@nestjs/common";
import { PessoasService } from "./pessoas.service";
import { CreatePessoaDto } from "./dto/create-pessoas.dto";
import { UpdatePessoaDto } from "./dto/update-pessoas.dto";

@Controller('pessoas')
export class PessoasController {
    constructor(private readonly pessoasService: PessoasService) {}
    
    @Post()
    create(@Body() createPessoaDto: CreatePessoaDto) {
        return this.pessoasService.create(createPessoaDto);
    }

    @Get()
    findAll() {
        return this.pessoasService.findAll();
    }

    @Get(':id')
    findOne(@Param('id', ParseIntPipe) id: number) {
        return this.pessoasService.findOne(id);
    }

    @Patch(':id')
    update(@Param('id', ParseIntPipe) id: number, @Body() updatePessoaDto: UpdatePessoaDto) { //parseIntPipe converts the id string from the URL to a number
        return this.pessoasService.update(id, updatePessoaDto);
    }

    @Delete(':id')
    remove(@Param('id', ParseIntPipe) id: number) {
        return this.pessoasService.remove(id);
    }
}