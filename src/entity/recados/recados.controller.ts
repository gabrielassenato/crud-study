import {
  Body,
  Controller,
  Delete,
  Get,
  Param,
  Patch,
  Post,
  Query,
  UseGuards,
  UsePipes,
} from '@nestjs/common';
import { RecadosService } from './recados.service';
import { CreateRecadoDto } from './dto/create-recados.dto';
import { UpdateRecadoDto } from './dto/update-recado-dto';
import { PaginationDto } from 'src/common/dto/pagination.dto';
import { ParseIntIdPipe } from 'src/common/pipes/parse-int-id.pipe';
import { AuthTokenGuard } from 'src/auth/guards/auth-token.guards';
import { TokenPayloadParam } from 'src/auth/params/token-payload.param';
import { TokenPayloadDto } from 'src/auth/dto/token-payload.dto';

@UsePipes(ParseIntIdPipe)
@Controller('recados')
export class RecadosController {
  constructor(private readonly recadosService: RecadosService) {}

  @Get()
  async findAll(@Query() paginationDto: PaginationDto) {
    const recados = await this.recadosService.findAll(paginationDto);

    return recados;
  }

  @Get(':id')
  findOne(@Param('id') id: number) {
    return this.recadosService.findOne(id);
  }

  @UseGuards(AuthTokenGuard)
  @Post()
  create(@Body() createBodyDto: CreateRecadoDto, @TokenPayloadParam() tokenPayload: TokenPayloadDto) {
    return this.recadosService.create(createBodyDto, tokenPayload);
  }

  @UseGuards(AuthTokenGuard)
  @Patch(':id')
  update(@Param('id') id: number, @Body() updateRecadoDto: UpdateRecadoDto, @TokenPayloadParam() tokenPayload: TokenPayloadDto) {
    return this.recadosService.update(id, updateRecadoDto, tokenPayload);
  }

  @UseGuards(AuthTokenGuard)
  @Delete(':id')
  remove(@Param('id') id: number, @TokenPayloadParam() tokenPayload: TokenPayloadDto) {
    return this.recadosService.remove(id, tokenPayload);
  }
}
