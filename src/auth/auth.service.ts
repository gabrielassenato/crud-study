import { Inject, Injectable, UnauthorizedException } from '@nestjs/common';
import { LoginDto } from './dto/login.dto';
import { Pessoa } from 'src/entity/pessoas/entities/pessoa.entity';
import { Repository } from 'typeorm';
import { InjectRepository } from '@nestjs/typeorm';
import { HashingService } from './hashing/hashing.service';
import jwtConfig from './config/jwt.config';
import { ConfigType } from '@nestjs/config';
import { JwtService } from '@nestjs/jwt';
import { RefreshTokenDto } from './dto/refresh-token.dto';
import { create } from 'domain';

@Injectable()
export class AuthService {
  constructor(
    @InjectRepository(Pessoa)
    private readonly pessoaRepository: Repository<Pessoa>,
    private readonly hashingService: HashingService,
    @Inject(jwtConfig.KEY)
    private readonly jwtConfiguration: ConfigType<typeof jwtConfig>,
    private readonly jwtService: JwtService,
  ) {
    console.log(this.jwtConfiguration);
  }

  async login(loginDto: LoginDto) {
    let passwordIsValid = false;
    let throwError = true;

    const pessoa = await this.pessoaRepository.findOneBy({
      email: loginDto.email,
      active: true,
    });

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
      throw new UnauthorizedException('Pessoa não autorizada');
    }

    if (!pessoa) {
      throw new UnauthorizedException('Pessoa não autorizada');
    }

    return this.createTokens(pessoa);
  }

  private async createTokens(pessoa: Pessoa) {
    const accessToken = await this.signJwtAsync<Partial<Pessoa>>(
      pessoa.id,
      this.jwtConfiguration.jwtTtl,
      { email: pessoa.email },
    );

    const refreshToken = await this.signJwtAsync(
      pessoa.id,
      this.jwtConfiguration.jwtRefreshTtl,
    );

    return { accessToken, refreshToken };
  }

  private async signJwtAsync<T>(sub: number, expiresIn: number, payload?: T) {
    return await this.jwtService.signAsync(
      {
        sub,
        ...payload,
      },
      {
        audience: this.jwtConfiguration.audience,
        issuer: this.jwtConfiguration.issuer,
        secret: this.jwtConfiguration.secret,
        expiresIn,
      },
    );
  }

  async refreshTokens(refreshTokenDto: RefreshTokenDto) {
    try {
      const {sub} = await this.jwtService.verifyAsync(
        refreshTokenDto.refreshToken,
        this.jwtConfiguration
      )

      const pessoa = await this.pessoaRepository.findOneBy({
        id: Number(sub),
        active: true,
      })

      if (!pessoa) {
        throw new Error('Pessoa não autorizada');
      }

      return this.createTokens(pessoa);
    } catch (error) {
      throw new UnauthorizedException(error.message);
    }
  }
}
