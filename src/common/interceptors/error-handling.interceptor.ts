import { BadRequestException, CallHandler, ExecutionContext, NestInterceptor } from '@nestjs/common';
import { catchError, Observable, tap, throwError } from 'rxjs';

// Este exemplo intercepta a resposta do controller e adiciona um cabeçalho
export class ErrorHandlingInterceptor implements NestInterceptor {
  async intercept(
    context: ExecutionContext,
    next: CallHandler, // chama o proximo interceptor ou o controller
  ) {
    console.log('ErrorHandlingInterceptor executado antes');

    // await new Promise((resolve) => setTimeout(resolve, 4000));

    return next.handle().pipe(
        catchError((err) => {
            console.log('ErrorHandlingInterceptor interceptou o erro');
            return throwError(() => {
                if (err.name === 'NotFoundException') {
                    return new BadRequestException(err.message);
                }
            });
        })
    );
  }
}
