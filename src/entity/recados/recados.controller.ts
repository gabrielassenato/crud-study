import {
  Body,
  Controller,
  Delete,
  Get,
  Param,
  Patch,
  Post,
  Query,
} from '@nestjs/common';
import { RecadosService } from './recados.service';
import { CreateRecadoDto } from './dto/create-recados.dto';
import { UpdateRecadoDto } from './dto/update-recado-dto';

@Controller('recados')
export class RecadosController {
    constructor(private readonly recadosService: RecadosService) {}
  @Get()
  findAll(@Query() pagination: any) {
    // const { limit = 10, offset = 0 } = pagination;
    // return `Todos os recados encontrados. Limit=${limit}, Offset=${offset}`;
    return this.recadosService.findAll();
  }

  @Get(':id')
  findOne(@Param('id') id: string) {
    return this.recadosService.findOne(id);
  }

  @Post()
  create(@Body() createBodyDto: CreateRecadoDto) {
    return this.recadosService.create(createBodyDto);
  }

  @Patch(':id')
  update(@Param('id') id: string, @Body() updateRecadoDto: UpdateRecadoDto) {
    return this.recadosService.update(id, updateRecadoDto);
  }

  @Delete(':id')
  remove(@Param('id') id: string) {
    console.log(id, typeof id);
    return this.recadosService.remove(id);
  }
}
