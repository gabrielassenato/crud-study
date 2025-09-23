import { PessoasService } from './pessoas.service';
import { Repository } from 'typeorm';
import { Pessoa } from './entities/pessoa.entity';
import { HashingService } from 'src/auth/hashing/hashing.service';
import { Test, TestingModule } from '@nestjs/testing';
import { getRepositoryToken } from '@nestjs/typeorm';
import { create } from 'domain';
import e from 'express';
import { ConflictException } from '@nestjs/common';

describe('PessoasService', () => {
  let pessoaService: PessoasService;
  let pessoaRepository: Repository<Pessoa>;
  let hashingService: HashingService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        PessoasService,
        {
          provide: getRepositoryToken(Pessoa),
          useValue: {
            save: jest.fn(),
            create: jest.fn(),
          },
        },
        {
          provide: HashingService,
          useValue: {
            hash: jest.fn(),
          },
        },
      ],
    }).compile();

    pessoaService = module.get<PessoasService>(PessoasService);
    pessoaRepository = module.get<Repository<Pessoa>>(
      getRepositoryToken(Pessoa),
    );
    hashingService = module.get<HashingService>(HashingService);
  });

  it('deve estar definido', () => {
    expect(pessoaService).toBeDefined();
  });

  describe('create', () => {
    it('deve criar uma nova pessoa', async () => {
        // createPessoaDto
        const createPessoaDto = {
            email: 'gabriel@email.com',
            nome: 'Gabriel',
            password: 'novaSenha123'
        }
        const passwordHash = 'HASHEDESENHA';
        const novaPessoa = { 
          id: 1, 
          nome: createPessoaDto.nome,
          email: createPessoaDto.email,
          passwordHash
        };

        jest.spyOn(hashingService, 'hash').mockResolvedValue(passwordHash);
        jest.spyOn(pessoaRepository, 'create').mockReturnValue(novaPessoa as any);

        // act -> ação
        const result = await pessoaService.create(createPessoaDto);

        // assert
        
        // o método hashingService.hash foi chamado com createPessoaDto.password?
        expect(hashingService.hash).toHaveBeenCalledWith(createPessoaDto.password);
        
        // o método pessoaRepository.create foi chamado com os dados da 
        // nova pessoa com o hash de senha gerado por hashingService.hash?
        expect(pessoaRepository.create).toHaveBeenCalledWith({
            nome: createPessoaDto.nome,
            email: createPessoaDto.email,
            passwordHash
        });

        // o método pessoaRepository.save foi chamado com os dados 
        // da nova pessoa gerada por pessoaRepository.create?
        expect(pessoaRepository.save).toHaveBeenCalledWith(novaPessoa);

        //o resultado do método pessoaService.create retornou a nova pessoa criada?
        expect(result).toEqual(novaPessoa);
    });

    it('deve lançar ConflictException ao tentar criar uma pessoa com email já existente', async () => {
        jest.spyOn(pessoaRepository, 'save').mockRejectedValue({
          code: '23505', // código de erro do PostgreSQL para violação de chave única
        });
        await expect(pessoaService.create({} as any)).rejects.toThrow(ConflictException);
    });
  });    
});
