import { CallHandler, ExecutionContext, NestInterceptor } from '@nestjs/common';
import { of, tap } from 'rxjs';

// Este exemplo intercepta a resposta do controller e adiciona um cabeçalho
export class SimpleCacheInterceptor implements NestInterceptor {
    private readonly cache = new Map();

  async intercept(
    context: ExecutionContext,
    next: CallHandler, // chama o proximo interceptor ou o controller
  ) {
    console.log('SimpleCacheInterceptor executado antes');
    const request = context.switchToHttp().getRequest();
    const url = request.url;

    if (this.cache.has(url)) {
        console.log('Está no cache', url);
        return of(this.cache.get(url));
    }

    await new Promise((resolve) => setTimeout(resolve, 4000));

    return next.handle().pipe(
        tap((data) => {
            this.cache.set(url, data);
            console.log('Cache atualizado', url);
        })
    );
  }
}
