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
import { HashingService } from 'src/auth/hashing/hashing.service';
import { TokenPayloadDto } from 'src/auth/dto/token-payload.dto';

@Injectable()
export class PessoasService {
  constructor(
    @InjectRepository(Pessoa)
    private readonly pessoasRepository: Repository<Pessoa>,
    private readonly hashingService: HashingService,
  ) {}

  async create(createPessoaDto: CreatePessoaDto) {
    try {
      // vai criar a hash da senha a partir da senha que veio no DTO
      const passwordHash = await this.hashingService.hash(
        createPessoaDto.password,
      );

      const pessoaData = {
        nome: createPessoaDto.nome,
        email: createPessoaDto.email,
        passwordHash // Assuming password is hashed before saving
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

  async update(id: number, updatePessoaDto: UpdatePessoaDto, tokenPayload: TokenPayloadDto) {
    const pessoaData = {
      nome: updatePessoaDto?.nome,
    };

    if (updatePessoaDto?.password) {
      // Se uma nova senha for fornecida, crie o hash dela
      const passwordHash = await this.hashingService.hash(
        updatePessoaDto.password,
      );

      pessoaData['passwordHash'] = passwordHash;
    }

    const pessoa = await this.pessoasRepository.preload({
      id,
      ...pessoaData,
    });

    if (!pessoa) {
      throw new NotFoundException(`Pessoa com id ${id} não encontrada`);
    }

    return this.pessoasRepository.save(pessoa);
  }

  async remove(id: number, tokenPayload: TokenPayloadDto) {
    const pessoa = await this.pessoasRepository.findOneBy({
      id,
    });

    if (!pessoa) {
      throw new NotFoundException(`Pessoa com id ${id} não encontrada`);
    }

    return this.pessoasRepository.remove(pessoa);
  }
}
