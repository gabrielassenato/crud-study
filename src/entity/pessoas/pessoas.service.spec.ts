import { PessoasService } from './pessoas.service';
import { Repository } from 'typeorm';
import { Pessoa } from './entities/pessoa.entity';
import { HashingService } from 'src/auth/hashing/hashing.service';
import { Test, TestingModule } from '@nestjs/testing';
import { getRepositoryToken } from '@nestjs/typeorm';
import { create } from 'domain';

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
        // que o hashing service tenha o metodo hash
        // saber se o hashing service foi chamado com CreatePessoaDto.password 
        // saber se o repository create foi chamado com os dados corretos
        // o retorno final deve ser a nova pessoa criada -> expect 

        jest.spyOn(hashingService, 'hash').mockResolvedValue(passwordHash);

        // act
        await pessoaService.create(createPessoaDto);

        // assert
        expect(hashingService.hash).toHaveBeenCalledWith(createPessoaDto.password);
        expect(pessoaRepository.create).toHaveBeenCalledWith({
            nome: createPessoaDto.nome,
            email: createPessoaDto.email,
            passwordHash: 'HASHEDESENHA'
        });
    });
  })
});
