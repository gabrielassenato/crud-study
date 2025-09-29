import { PessoasService } from './pessoas.service';
import { Repository } from 'typeorm';
import { Pessoa } from './entities/pessoa.entity';
import { HashingService } from 'src/auth/hashing/hashing.service';
import { Test, TestingModule } from '@nestjs/testing';
import { getRepositoryToken } from '@nestjs/typeorm';
import { create } from 'domain';
import e from 'express';
import { ConflictException, ForbiddenException, NotFoundException } from '@nestjs/common';
import { find } from 'rxjs';

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
            findOneBy: jest.fn(),
            find: jest.fn(),
            preload: jest.fn(),
            remove: jest.fn(),
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
        password: 'novaSenha123',
      };
      const passwordHash = 'HASHEDESENHA';
      const novaPessoa = {
        id: 1,
        nome: createPessoaDto.nome,
        email: createPessoaDto.email,
        passwordHash,
      };

      jest.spyOn(hashingService, 'hash').mockResolvedValue(passwordHash);
      jest.spyOn(pessoaRepository, 'create').mockReturnValue(novaPessoa as any);

      // act -> ação
      const result = await pessoaService.create(createPessoaDto);

      // assert

      // o método hashingService.hash foi chamado com createPessoaDto.password?
      expect(hashingService.hash).toHaveBeenCalledWith(
        createPessoaDto.password,
      );

      // o método pessoaRepository.create foi chamado com os dados da
      // nova pessoa com o hash de senha gerado por hashingService.hash?
      expect(pessoaRepository.create).toHaveBeenCalledWith({
        nome: createPessoaDto.nome,
        email: createPessoaDto.email,
        passwordHash,
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
      await expect(pessoaService.create({} as any)).rejects.toThrow(
        ConflictException,
      );
    });

    it('deve lançar um erro genérico quando um erro for lançado', async () => {
      jest
        .spyOn(pessoaRepository, 'save')
        .mockRejectedValue(new Error('Erro genérico'));

      await expect(pessoaService.create({} as any)).rejects.toThrow(
        new Error('Erro genérico'),
      );
    });
  });

  describe('findOne', () => {
    it('Deve retornar uma pessoa se a pessoa for encontrada', async () => {
      const pessoaId = 1;
      const pessoaEncontrada = {
        id: pessoaId,
        nome: 'Gabriel',
        email: 'gabriel@email.com',
        passwordHash: '123456',
      };

      jest.spyOn(pessoaRepository, 'findOneBy').mockResolvedValue(pessoaEncontrada as any);

      const result = await pessoaService.findOne(pessoaId);

      expect(result).toEqual(pessoaEncontrada);
    });

    it('Deve lançar um erro quando uma pessoa não for encontrada', async () => {
      const pessoaId = 1;
      const pessoaEncontrada = {
        id: pessoaId,
        nome: 'Gabriel',
        email: 'gabriel@email.com',
        passwordHash: '123456',
      };

      await expect (pessoaService.findOne(pessoaId)).rejects.toThrow(
        new NotFoundException(`Pessoa com id 1 não encontrada`)
      );
    });
  });

  describe('findAll', () => {
    it('Deve retornar todas as pessoas', async () => {
      const pessoasMock: Pessoa[] = [
        {
          id: 1,
          nome: 'Gabriel',
          email: 'gabriel@email.com',
          passwordHash: '123456',
        } as Pessoa,
      ];

      jest.spyOn(pessoaRepository, 'find').mockResolvedValue(pessoasMock);

      const result = await pessoaService.findAll();

      expect(result).toEqual(pessoasMock);
      expect(pessoaRepository.find).toHaveBeenCalledWith({
        order: {
          createdAt: 'DESC',
        },
      });
    });
  });

  describe('update', () => {
    it ('Deve atualizar uma pessoa se for autorizado', async () => {
      // arrange
      const pessoaId = 1;
      const updatePessoaDto = {
        nome: 'Gabriel Atualizado',
        password: 'senhaAtualizada123',
      };
      const tokenPayload = { sub: pessoaId } as any;
      const passwordHash = 'HASHEDESENHA';
      const updatePessoa = {id: pessoaId, nome: 'Gabriel Atualizado', passwordHash};

      jest.spyOn(hashingService, 'hash').mockResolvedValueOnce(passwordHash);
      jest.spyOn(pessoaRepository, 'preload').mockResolvedValue(updatePessoa as any);
      jest.spyOn(pessoaRepository, 'save').mockResolvedValue(updatePessoa as any);

      // act
      const result = await pessoaService.update(pessoaId, updatePessoaDto as any, tokenPayload);

      //assert 
      expect(result).toEqual(updatePessoa);
      expect(hashingService.hash).toHaveBeenCalledWith(updatePessoaDto.password);
      expect(pessoaRepository.preload).toHaveBeenCalledWith({
        id: pessoaId,
        nome: updatePessoaDto.nome,
        passwordHash,
      });
      expect(pessoaRepository.save).toHaveBeenCalledWith(updatePessoa);
    })

    it('deve lançar ForbiddenException se usuário não autorizado', async () => {
      // arrange
      const pessoaId = 1; // usuário certo (id: 1)
      const tokenPayload = { sub: 2 } as any; // usuário diferente (id: 2)
      const updatePessoaDto = { nome: 'Maria Joaquina' };
      const existingPessoa = { id: pessoaId, nome: 'Maria Joaquina' };

      // simula que a pessoa existe
      jest
        .spyOn(pessoaRepository, 'preload')
        .mockResolvedValue(existingPessoa as any);

      // act e assert
      await expect(
        pessoaService.update(pessoaId, updatePessoaDto, tokenPayload),
      ).rejects.toThrow(ForbiddenException);
    });

    it('deve lançar NotFoundException se a pessoa não existe', async () => {
      // Arrange
      const pessoaId = 1;
      const tokenPayload = { sub: pessoaId } as any;
      const updatePessoaDto = { nome: 'Jane Doe' };

      // Simula que preload retornou null
      jest.spyOn(pessoaRepository, 'preload').mockResolvedValue(null as any);

      // Act e Assert
      await expect(
        pessoaService.update(pessoaId, updatePessoaDto, tokenPayload),
      ).rejects.toThrow(NotFoundException);
    });
  });

  describe('remove', () => {
    it('deve remover uma pessoa se autorizado', async () => {
      // arrange
      const pessoaId = 1; // Pessoa com ID 1
      const tokenPayload = { sub: pessoaId } as any; // usuário com id 1
      const existingPessoa = { id: pessoaId, nome: 'John Doe' }; // pessoa é o usuário

      // findOne do service vai retornar a pessoa existente
      jest
        .spyOn(pessoaService, 'findOne')
        .mockResolvedValue(existingPessoa as any);
      // o método remove do repositório também vai retornar a pessoa existente
      jest
        .spyOn(pessoaRepository, 'remove')
        .mockResolvedValue(existingPessoa as any);

      // act
      const result = await pessoaService.remove(pessoaId, tokenPayload);

      // assert
      // espero que findOne do pessoaService seja chamado com o ID da pessoa
      expect(pessoaService.findOne).toHaveBeenCalledWith(pessoaId);
      // espero que o remove do repositório seja chamado com a pessoa existente
      expect(pessoaRepository.remove).toHaveBeenCalledWith(existingPessoa);
      // espero que a pessoa apagada seja retornada
      expect(result).toEqual(existingPessoa);
    });

    it('deve lançar ForbiddenException se não autorizado', async () => {
      // arrange
      const pessoaId = 1; // pessoa com id 1
      const tokenPayload = { sub: 2 } as any; // usuário com id 2
      const existingPessoa = { id: pessoaId, nome: 'John Doe' }; // pessoa não é o usuário

      // espero que o findOne seja chamado com pessoa existente
      jest
        .spyOn(pessoaService, 'findOne')
        .mockResolvedValue(existingPessoa as any);

      // espero que o servico rejeite porque o usuário é diferente da pessoa
      await expect(
        pessoaService.remove(pessoaId, tokenPayload),
      ).rejects.toThrow(ForbiddenException);
    });

    it('deve lançar NotFoundException se a pessoa não for encontrada', async () => {
      const pessoaId = 1;
      const tokenPayload = { sub: pessoaId } as any;

      // só precisamos que o findOne lance uma exception e o remove também deve lançar
      jest
        .spyOn(pessoaService, 'findOne')
        .mockRejectedValue(new NotFoundException());

      await expect(
        pessoaService.remove(pessoaId, tokenPayload),
      ).rejects.toThrow(NotFoundException);
    });
  });
});
