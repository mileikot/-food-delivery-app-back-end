import {
  ArgumentMetadata,
  BadRequestException,
  HttpException,
  HttpStatus,
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

    const transformed = this.parseValue(value);

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

  private parseValue(value: any) {
    try {
      return Object.keys(value).reduce((acc, key) => {
        acc[key] = JSON.parse(value[key]);

        return acc;
      }, {});
    } catch (error) {
      throw new HttpException(error.message, HttpStatus.BAD_REQUEST, {
        cause: error,
      });
    }
  }

  private toValidate(metatype: Type): boolean {
    const types: Type[] = [String, Boolean, Number, Array, Object];
    return !types.includes(metatype);
  }
}
