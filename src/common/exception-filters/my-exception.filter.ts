import {
  ArgumentsHost,
  BadRequestException,
  Catch,
  ExceptionFilter,
  HttpException,
  HttpStatus,
  NotFoundException,
} from '@nestjs/common';

// posso usar a HttpException para capturar todas as exceções
@Catch(BadRequestException /*, NotFoundException*/)
export class MyExceptionFilter<T extends BadRequestException> // ai precisaria incluir aqui tb a HttpException
  implements ExceptionFilter
{
  catch(exception: T, host: ArgumentsHost) {
    const ctx = host.switchToHttp();
    const res = ctx.getResponse();
    const req = ctx.getRequest();

    const statusCode = exception.getStatus();
    const exeptionResponse = exception.getResponse();

    const error =
      typeof res === 'string'
        ? {
            message: exeptionResponse,
          }
        : (exeptionResponse as object);

    res.status(statusCode).json({
      ...error,
      data: new Date().toISOString(),
      path: req.url,
    });
  }
}
