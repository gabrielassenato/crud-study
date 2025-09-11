import { Inject, Injectable, UnauthorizedException } from '@nestjs/common';
import { LoginDto } from './dto/login.dto';
import { Pessoa } from 'src/entity/pessoas/entities/pessoa.entity';
import { Repository } from 'typeorm';
import { InjectRepository } from '@nestjs/typeorm';
import { HashingService } from './hashing/hashing.service';
import jwtConfig from './config/jwt.config';
import { ConfigType } from '@nestjs/config';

@Injectable()
export class AuthService {
    constructor(
        @InjectRepository(Pessoa)
        private readonly pessoaRepository: Repository<Pessoa>,
        private readonly hashingService: HashingService,
        @Inject(jwtConfig.KEY)
        private readonly jwtConfiguration: ConfigType<typeof jwtConfig>,
    ) {console.log(this.jwtConfiguration);}

    async login(loginDto: LoginDto) {
        let passwordIsValid = false;
        let throwError = true;

        const pessoa = await this.pessoaRepository.findOneBy({ email: loginDto.email });

        if (pessoa) {
            passwordIsValid = await this.hashingService.compare(
                loginDto.password,
                pessoa.passwordHash,
            );
        }

        if (passwordIsValid) {
            throwError = false;
        }

        if (throwError) {
            throw new UnauthorizedException('Invalid credentials');
        }

        // vamos fazer o novo token e vamos entregar para o usuário na resposta

        return { message: 'Login successful' };
    }
}
