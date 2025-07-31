import { HttpException, HttpStatus } from '@nestjs/common';
import { Recado } from './entities/recado.entity';
import { CreateRecadoDto } from './dto/create-recados.dto';
import { UpdateRecadoDto } from './dto/update-recado-dto';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { read } from 'fs';

export class RecadosService {
  constructor(
    @InjectRepository(Recado)
    private readonly recadoRepository: Repository<Recado>,
  ) {}

  private recados: Recado[] = [
    {
      id: 1,
      texto: 'Recado 1',
      de: 'João',
      para: 'Maria',
      lido: false,
      createdAt: new Date(),
      updatedAt: new Date(),
    },
  ];

  throwNotFoundError() {
    throw new HttpException('Recado não encontrado.', HttpStatus.NOT_FOUND);
  }

  async findAll() {
    const recados = await this.recadoRepository.find();
    return recados;
  }

  async findOne(id: number) {
    const recado = await this.recadoRepository.findOne({
      where: {
        id: id,
      },
    });

    if (recado) return recado;

    this.throwNotFoundError();
  }

  async create(createRecadoDto: CreateRecadoDto) {
    const newRecado = {
      ...createRecadoDto,
      lido: false,
    };

    const recado = await this.recadoRepository.create(newRecado);

    return this.recadoRepository.save(recado);
  }

  async update(id: number, updateRecadoDto: UpdateRecadoDto) {
    const partialUpdateRecadoDto = {
      lido: updateRecadoDto?.lido,
      texto: updateRecadoDto?.texto,
    }
    const recado = await this.recadoRepository.preload({
      id, 
      ...partialUpdateRecadoDto,
    })

    if (!recado) {
      return this.throwNotFoundError();
    }

    return this.recadoRepository.save(recado);
  }

  async remove(id: number) {
    const recado = await this.recadoRepository.findOneBy({
      id,
    });

    if (!recado) {
      return this.throwNotFoundError();
    }
    
    return this.recadoRepository.remove(recado);
  }
}
