import {
  ArgumentMetadata,
  BadRequestException,
  Injectable,
  PipeTransform,
  Type,
} from '@nestjs/common';
import { plainToInstance } from 'class-transformer';
import { validate } from 'class-validator';

@Injectable()
export class TransformFormDataPipe implements PipeTransform<any> {
  async transform(value: any, { metatype }: ArgumentMetadata) {
    if (!metatype || !this.toValidate(metatype)) {
      return value;
    }

    const transformed = Object.keys(value).reduce((acc, key) => {
      acc[key] = JSON.parse(value[key]);

      return acc;
    }, {});

    const object = plainToInstance(metatype, transformed);
    const errors = await validate(object);

    if (errors.length > 0) {
      const errorList = errors.map((error) =>
        error.toString(false, true, '', true),
      );
      throw new BadRequestException(errorList);
    }

    return object;
  }

  private toValidate(metatype: Type): boolean {
    const types: Type[] = [String, Boolean, Number, Array, Object];
    return !types.includes(metatype);
  }
}
