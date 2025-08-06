import { NestMiddleware } from "@nestjs/common";
import { NextFunction, Request, Response } from "express";

export class AnotherMiddleware implements NestMiddleware {
    use(req: Request, res: Response, next: NextFunction) {
        console.log('AnotherMiddleware: Olá');
        const authorization = req.headers?.authorization;

        // se o token for válido, adiciona o usuário ao request
        if (authorization) {
            req['user'] = {
                nome: 'John Doe',
                email: 'john.doe@example.com'
            }
        }

        res.setHeader('X-Custom-Cabecalho', 'Do Middleware');
        
        // terminando a cadeia de chamadas
        // return res.status(404).send({
        //     message: 'não encontrado'
        // })

        next(); // chama o próximo middleware ou o controller
        console.log('AnotherMiddleware: Tchau'); // se tiver mais de um middleware, o next() chama o próximo middleware e depois esse console.log
    }
}           