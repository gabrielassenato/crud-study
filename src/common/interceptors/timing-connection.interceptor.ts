import { CallHandler, ExecutionContext, NestInterceptor } from '@nestjs/common';
import { Observable, tap } from 'rxjs';

// Este exemplo intercepta a resposta do controller e adiciona um cabeçalho
export class TimingConnectionInterceptor implements NestInterceptor {
  async intercept(
    context: ExecutionContext,
    next: CallHandler, // chama o proximo interceptor ou o controller
  ) {
    const startTime = Date.now();

    console.log('TimingConnectionInterceptor executado antes');

    await new Promise((resolve) => setTimeout(resolve, 4000));

    return next.handle().pipe(
        tap(() => {
            const finalTime = Date.now();
            const elapsedTime = finalTime - startTime;
            console.log(`Interceptor teve o tempo de execução: ${elapsedTime}ms`);
        })
    );
  }
}
