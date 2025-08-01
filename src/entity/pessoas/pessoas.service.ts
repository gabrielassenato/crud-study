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
      },
    });
    return pessoas;
  }

    async findOne(id: number) {
      const pessoa = await this.pessoasRepository.findOneBy({
        id,
      });

      if (!pessoa) {
        throw new NotFoundException(`Pessoa com id ${id} não encontrada`);
      }

      return pessoa;
    }

  async update(id: number, updatePessoaDto: UpdatePessoaDto) {
    const pessoaData = {
      nome: updatePessoaDto?.nome,
      passwordHash: updatePessoaDto?.password,
    };

    const pessoa = await this.pessoasRepository.preload({
      id,
      ...pessoaData,
    });

    if (!pessoa) {
      throw new NotFoundException(`Pessoa com id ${id} não encontrada`);
    }

    return this.pessoasRepository.save(pessoa);
  }

  async remove(id: number) {
    const pessoa = await this.pessoasRepository.findOneBy({
      id,
    });

    if (!pessoa) {
      throw new NotFoundException(`Pessoa com id ${id} não encontrada`);
    }

    return this.pessoasRepository.remove(pessoa);
  }
}
