import { Injectable } from "@nestjs/common";

@Injectable()
export class PessoasService {
    findAll() {
        return "Lista de pessoasss";
    }

    findOne(id: string) {
        return `Detalhes da pessoa com ID: ${id}`;
    }

    create(body: any) {
        return body;
    }

    update(id: string, body: any) {
        return {
            id,
            ...body // desempacote esse objeto dentro do objeto retornado
        };
    }

    remove(id: string) {
        return `Pessoa com ID: ${id} foi deletada`;
    }
}