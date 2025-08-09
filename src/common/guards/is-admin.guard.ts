import { CanActivate, ExecutionContext, Inject, Injectable } from "@nestjs/common";
import { Observable } from "rxjs";

@Injectable()
export class IsAdminGuard implements CanActivate {
  canActivate(
    context: ExecutionContext
): boolean | Promise<boolean> | Observable<boolean> {
    const request = context.switchToHttp().getRequest();
    const role = request['user']?.role;

    // ao inves de todo esse trecho a baixo poderia utilizar somente isso:
    // return role === 'admin'; que ai ele iria retornar falso ou verdadeiro

    if (role === 'admin') {
      return true;
    }

    return false; // não pode acessar a rota
  }
}