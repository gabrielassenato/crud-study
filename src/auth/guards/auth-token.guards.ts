import { CanActivate, ExecutionContext, Inject, Injectable, UnauthorizedException } from "@nestjs/common";
import { ConfigType } from "@nestjs/config";
import { JwtService } from "@nestjs/jwt";
import { Request } from "express";
import jwtConfig from "../config/jwt.config";
import { REQUEST_TOKEN_PAYLOAD_KEY } from "../auth.constants";
import { InjectRepository } from "@nestjs/typeorm";
import { Pessoa } from "src/entity/pessoas/entities/pessoa.entity";
import { In, Repository } from "typeorm";

@Injectable()
export class AuthTokenGuard implements CanActivate {
    constructor(
        @InjectRepository(Pessoa)
        private readonly pessoaRepository: Repository<Pessoa>,
        private readonly jwtService: JwtService,
        @Inject(jwtConfig.KEY) 
        private readonly jwtConfiguration: ConfigType<typeof jwtConfig>,
    ) {}
    async canActivate(
        context: ExecutionContext, 
    ): Promise<boolean> {
        const request: Request = context.switchToHttp().getRequest();
        const token = this.extractTokenFromHeader(request);

        if (!token) {
            throw new UnauthorizedException('Não logado');
        }

        try {
            const payload = await this.jwtService.verifyAsync(
                token,
                this.jwtConfiguration
            );

            const pessoa = await this.pessoaRepository.findOneBy({
                id: Number(payload.sub),
                active: true,
            });

            if (!pessoa) {
                throw new UnauthorizedException('Pessoa não autorizada');
            }

            request[REQUEST_TOKEN_PAYLOAD_KEY] = payload;
        } catch (error) {
            throw new UnauthorizedException(error.message);
        }

        return true;
    }

    extractTokenFromHeader(request: Request): string | undefined {
        const authorization = request.headers?.authorization;

        if (!authorization || typeof authorization !== 'string') {
            return;
        }

        return authorization.split(' ')[1];
    }
}