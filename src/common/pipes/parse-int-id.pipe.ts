import {
  ArgumentMetadata,
  BadRequestException,
  Injectable,
  PipeTransform,
} from '@nestjs/common';

@Injectable()
export class ParseIntIdPipe implements PipeTransform {
  transform(value: string, metadata: ArgumentMetadata) {
    // console.log('ParseIntIdPipe executado depois do interceptor');
    if (metadata.type !== 'param' || metadata.data !== 'id') {
      return value;
    }

    const parsedValue = Number(value);

    if (isNaN(parsedValue)) {
      throw new BadRequestException('Param ID is not a number');
    }

    if (parsedValue < 1) {
      throw new BadRequestException('Param ID must be positive');
    }

    return parsedValue;
  }
}
