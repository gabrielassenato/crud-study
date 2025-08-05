import { CallHandler, ExecutionContext, NestInterceptor } from '@nestjs/common';
import { Observable } from 'rxjs';

// Este exemplo intercepta a resposta do controller e adiciona um cabeçalho
export class AddHeaderInterceptor implements NestInterceptor {
  intercept(
    context: ExecutionContext,
    next: CallHandler, // chama o proximo interceptor ou o controller
  ): Observable<any> | Promise<Observable<any>> {
    console.log('Interceptor vai ser executado primeiro');

    const response = context.switchToHttp().getResponse();

    response.setHeader('X-Custom-Header', 'O valor do cabeçalho');

    return next.handle();
  }
}
