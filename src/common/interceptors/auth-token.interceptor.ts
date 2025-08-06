import { CallHandler, ExecutionContext, Injectable, NestInterceptor, UnauthorizedException } from '@nestjs/common';
import { Observable } from 'rxjs';

// Este exemplo intercepta a resposta do controller e adiciona um cabeçalho
@Injectable()
export class AuthTokenInterceptor implements NestInterceptor {
  async intercept(context: ExecutionContext, next: CallHandler): Promise<Observable<any>> {
    const request = context.switchToHttp().getRequest();
    const token = request.headers.authorization?.split(' ')[1];
    
    if (!token || token !== 'aquiVemOToken') {
      throw new UnauthorizedException('User is not authenticated');
    }

    return next.handle();
  }
}
