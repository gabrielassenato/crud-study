import { ForbiddenException, HttpException, HttpStatus } from '@nestjs/common';
import { Recado } from './entities/recado.entity';
import { CreateRecadoDto } from './dto/create-recados.dto';
import { UpdateRecadoDto } from './dto/update-recado-dto';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { PessoasService } from '../pessoas/pessoas.service';
import { PaginationDto } from 'src/common/dto/pagination.dto';
import { TokenPayloadDto } from 'src/auth/dto/token-payload.dto';

export class RecadosService {
  constructor(
    @InjectRepository(Recado)
    private readonly recadoRepository: Repository<Recado>,
    private readonly pessoasService: PessoasService, // importando o serviço de pessoas para usar se necessário
  ) {}

  throwNotFoundError() {
    throw new HttpException('Recado não encontrado.', HttpStatus.NOT_FOUND);
  }
  async findAll(paginationDto?: PaginationDto) {
    const { limit = 10, offset = 0 } = paginationDto || {};
    
    const recados = await this.recadoRepository.find({
      take: limit, // quantidade de registros a serem retornados
      skip: offset, // quantidade de registros a serem pulados
      order: {
        createdAt: 'DESC',
      },
      relations: ['de', 'para'],
      select: {
        de: {
          id: true,
          nome: true,
        },
        para: {
          id: true,
          nome: true,
        },
      },
    });
    return recados;
  }

  async findOne(id: number) {
    const recado = await this.recadoRepository.findOne({
      where: {
        id: id,
      },
      relations: ['de', 'para'],
      select: {
        de: {
          id: true,
          nome: true,
        },
        para: {
          id: true,
          nome: true,
        },
      },
    });

    if (recado) return recado;

    this.throwNotFoundError();
  }

  async create(createRecadoDto: CreateRecadoDto, tokenPayload: TokenPayloadDto) {
    const { paraId } = createRecadoDto;

    const de = await this.pessoasService.findOne(tokenPayload.sub); // quem está enviando o recado é o usuário autenticado

    const para = await this.pessoasService.findOne(paraId);

    const newRecado = {
      texto: createRecadoDto.texto,
      de,
      para,
      lido: false,
      createdAt: new Date(),
      updatedAt: new Date(),
    };

    const recado = await this.recadoRepository.create(newRecado);
    await this.recadoRepository.save(recado);

    return {
      ...recado,
      de: {
        id: de.id,
        nome: de.nome,
      },
      para: {
        id: para.id,
        nome: para.nome,
      },
    };
  }

  async update(id: number, updateRecadoDto: UpdateRecadoDto, tokenPayload: TokenPayloadDto) {
    const recado = await this.findOne(id);
    
    if (!recado) {
      return this.throwNotFoundError();
    }

    if (recado.de.id !== tokenPayload.sub) {
      throw new ForbiddenException('Você não tem permissão para atualizar este recado.');
    }

    recado.texto = updateRecadoDto?.texto ?? recado.texto;
    recado.lido = updateRecadoDto?.lido ?? recado.lido;

    await this.recadoRepository.save(recado);
    return recado;
  }

  async remove(id: number, tokenPayload: TokenPayloadDto) {
    const recado = await this.findOne(id);

    if (!recado) {
      return this.throwNotFoundError();
    }

    if (recado.de.id !== tokenPayload.sub) {
      throw new ForbiddenException('Você não tem permissão para atualizar este recado.');
    }
    
    return this.recadoRepository.remove(recado);
  }
}
