import {
  ConflictException,
  HttpException,
  HttpStatus,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import { Pessoa } from './entities/pessoa.entity';
import { CreatePessoaDto } from './dto/create-pessoas.dto';
import { UpdatePessoaDto } from './dto/update-pessoas.dto';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { read } from 'fs';

@Injectable()
export class PessoasService {
  constructor(
    @InjectRepository(Pessoa)
    private readonly pessoasRepository: Repository<Pessoa>,
  ) {}

  async create(createPessoaDto: CreatePessoaDto) {
    try {
      const pessoaData = {
        nome: createPessoaDto.nome,
        email: createPessoaDto.email,
        passwordHash: createPessoaDto.password, // Assuming password is hashed before saving
      };

      const newPessoa = this.pessoasRepository.create(pessoaData);
      await this.pessoasRepository.save(newPessoa);
      return newPessoa;
    } catch (error) {
      if (error.code === '23505') {
        // Unique constraint violation
        throw new ConflictException('Email já cadastrado.');
      }
      throw error;
    }
  }

  async findAll() {
    const pessoas = await this.pessoasRepository.find({
      order: {
        createdAt: 'DESC', // Order by createdAt in descending order
      }
    });
    return pessoas;
  }

  //   findOne(id: string) {
  //     const pessoa = this.pessoas.find((pessoa) => pessoa.id === +id);

  //     if (pessoa) return pessoa;

  //     throw new NotFoundException(`Pessoa com id ${id} não encontrada`);
  //   }

  //   update(id: string, updatePessoaDto: UpdatePessoaDto) {
  //     const pessoaIndex = this.pessoas.findIndex((pessoa) => pessoa.id === +id);

  //     if (pessoaIndex < 0) {
  //       throw new NotFoundException(`Pessoa com id ${id} não encontrada`);
  //     }

  //     const pessoaExistente = this.pessoas[pessoaIndex];

  //     this.pessoas[pessoaIndex] = {
  //       ...pessoaExistente,
  //       ...updatePessoaDto,
  //     };

  //     return this.pessoas[pessoaIndex];
  //   }

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
