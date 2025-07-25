import { HttpException, HttpStatus } from '@nestjs/common';
import { Recado } from './entities/recado.entity';
import { CreateRecadoDto } from './dto/create-recados.dto';
import { UpdateRecadoDto } from './dto/update-recado-dto';

export class RecadosService {
  private lastId = 1;
  private recados: Recado[] = [
    {
      id: 1,
      texto: 'Recado 1',
      de: 'João',
      para: 'Maria',
      lido: false,
      data: new Date(),
    },
  ];

  throwNotFoundError() {
    throw new HttpException('Recado não encontrado.', HttpStatus.NOT_FOUND);
  }

  findAll() {
    return this.recados;
  }

  findOne(id: string) {
    const recado = this.recados.find(item => item.id === +id);

    if (recado) {
      return recado;
    }
    this.throwNotFoundError();
  }

  create(createRecadoDto: CreateRecadoDto) {
    this.lastId++; // vai incrementar +1 no lastId declarado acima
    const id = this.lastId;
    const newRecado: Recado = {
      id,
      ...createRecadoDto,
      lido: false,
      data: new Date(),
    };
    this.recados.push(newRecado);

    return newRecado;
  }

  update(id: string, updateRecadoDto: UpdateRecadoDto) {
    const recadoExistenteIndex = this.recados.findIndex(
      item => item.id === +id,
    );

    if (recadoExistenteIndex < 0) {
      this.throwNotFoundError();
    }

    const recadoExistente = this.recados[recadoExistenteIndex];

    this.recados[recadoExistenteIndex] = {
      ...recadoExistente,
      ...updateRecadoDto,
    };

    return this.recados[recadoExistenteIndex];
  }

  remove(id: string) {
    const recadoExistenteIndex = this.recados.findIndex(
      item => item.id === +id,
    );

    if (recadoExistenteIndex < 0) {
      this.throwNotFoundError();
    }
    
    const recado = this.recados[recadoExistenteIndex];
    this.recados.splice(recadoExistenteIndex, 1);

    return recado;
  }
}
