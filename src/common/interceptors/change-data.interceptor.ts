import { CallHandler, ExecutionContext, NestInterceptor } from '@nestjs/common';
import { map, of, tap } from 'rxjs';

// Este exemplo intercepta a resposta do controller e adiciona um cabeçalho
export class ChangeDataInterceptor implements NestInterceptor {
  private readonly cache = new Map();

  async intercept(
    context: ExecutionContext,
    next: CallHandler, // chama o proximo interceptor ou o controller
  ) {
    console.log('ChangeDataInterceptor executado antes');

    return next.handle().pipe(
      map((data) => {
        if (Array.isArray(data)) {
          return {
            data,
            count: data.length,
          };
        }

        return data;
      }),
    );
  }
}
