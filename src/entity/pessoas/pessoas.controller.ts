import { Body, Controller, Delete, Get, Param, ParseIntPipe, Patch, Post, Req, UseGuards } from "@nestjs/common";
import { PessoasService } from "./pessoas.service";
import { CreatePessoaDto } from "./dto/create-pessoas.dto";
import { UpdatePessoaDto } from "./dto/update-pessoas.dto";
import { AuthTokenGuard } from "src/auth/guards/auth-token.guards";
import { Request } from "express";
import { REQUEST_TOKEN_PAYLOAD_KEY } from "src/auth/auth.constants";
import { TokenPayloadParam } from "src/auth/params/token-payload.param";
import { TokenPayloadDto } from "src/auth/dto/token-payload.dto";

@Controller('pessoas')
export class PessoasController {
    constructor(private readonly pessoasService: PessoasService) {}
    
    @Post()
    create(@Body() createPessoaDto: CreatePessoaDto) {
        return this.pessoasService.create(createPessoaDto);
    }

    @UseGuards(AuthTokenGuard)
    @Get()
    findAll(@Req() req: Request) {
        return this.pessoasService.findAll();
    }

    @UseGuards(AuthTokenGuard)
    @Get(':id')
    findOne(@Param('id', ParseIntPipe) id: number) {
        return this.pessoasService.findOne(id);
    }

    @UseGuards(AuthTokenGuard)
    @Patch(':id')
    update(
        @Param('id', ParseIntPipe) id: number, 
        @Body() updatePessoaDto: UpdatePessoaDto, 
        @TokenPayloadParam() tokenPayload: TokenPayloadDto
    ) {
        return this.pessoasService.update(id, updatePessoaDto, tokenPayload);
    }

    @UseGuards(AuthTokenGuard)
    @Delete(':id')
    remove(
        @Param('id', ParseIntPipe) id: number,
        @TokenPayloadParam() tokenPayload: TokenPayloadDto
    ) {
        return this.pessoasService.remove(id, tokenPayload);
    }
}