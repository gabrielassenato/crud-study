import { PessoasService } from './pessoas.service';
import { Repository } from 'typeorm';
import { Pessoa } from './entities/pessoa.entity';
import { HashingService } from 'src/auth/hashing/hashing.service';
import { Test, TestingModule } from '@nestjs/testing';
import { getRepositoryToken } from '@nestjs/typeorm';

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
          useValue: {},
        },
        {
          provide: HashingService,
          useValue: {},
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
    it('deve criar uma nova pessoa', () => {
        // createPessoaDto
        // que o hashing service tenha o metodo hash
        // saber se o hashing service foi chamado com CreatePessoaDto 
        // saber se o repository create foi chamado com os dados corretos
        // o retorno final deve ser a nova pessoa criada -> expect 
    });
  })
});
