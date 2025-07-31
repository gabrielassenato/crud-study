import {
  HttpException,
  HttpStatus,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import { Pessoa } from './entities/pessoa.entity';
import { CreatePessoasDto } from './dto/create-pessoas.dto';
import { UpdatePessoasDto } from './dto/update-pessoas.dto';

@Injectable()
export class PessoasService {
  private lastId = 1; // Simula um ID auto-incremental
  private pessoas: Pessoa[] = [
    {
      id: 1,
      nome: 'fulano',
      email: 'fulano@gmail.com',
      createdAt: new Date(),
      updatedAt: new Date(),
    },
  ];

  findAll() {
    return this.pessoas;
  }

  findOne(id: string) {
    const pessoa = this.pessoas.find((pessoa) => pessoa.id === +id);

    if (pessoa) return pessoa;

    throw new NotFoundException(`Pessoa com id ${id} não encontrada`);
  }

  create(createPessoasDto: CreatePessoasDto) {
    this.lastId++;
    const id = this.lastId;
    const newPessoa: Pessoa = {
      id,
      ...createPessoasDto,
      createdAt: new Date(),
      updatedAt: new Date(),
    };
    this.pessoas.push(newPessoa);
    return newPessoa;
  }

  update(id: string, updatePessoasDto: UpdatePessoasDto) {
    const pessoaIndex = this.pessoas.findIndex((pessoa) => pessoa.id === +id);

    if (pessoaIndex < 0) {
      throw new NotFoundException(`Pessoa com id ${id} não encontrada`);
    }

    const pessoaExistente = this.pessoas[pessoaIndex];

    this.pessoas[pessoaIndex] = {
      ...pessoaExistente,
      ...updatePessoasDto,
    };

    return this.pessoas[pessoaIndex];
  }

  remove(id: string) {
    const pessoaIndex = this.pessoas.findIndex((pessoa) => pessoa.id === +id);

    if (pessoaIndex < 0) {
      throw new NotFoundException(`Pessoa com id ${id} não encontrada`);
    }

    const pessoa = this.pessoas[pessoaIndex];

    this.pessoas.splice(pessoaIndex, 1);

    return pessoa;
  }
}
