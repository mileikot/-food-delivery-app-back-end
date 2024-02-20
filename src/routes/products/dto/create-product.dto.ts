import {
  ArrayNotEmpty,
  IsNumber,
  IsOptional,
  IsPositive,
  IsString,
  Max,
  MaxLength,
  Min,
  MinLength,
  Validate,
} from 'class-validator';

import { ProductStatuses } from '../statuses/productStatuses';
import { ProductStatusValidator } from '../validation';

import { IsBuffer } from '@/lib/class-validator';

export class CreateProductDto {
  @IsString()
  @MinLength(5)
  readonly title: string;

  @IsString()
  @MaxLength(500)
  readonly description: string;

  @IsPositive()
  @IsNumber()
  readonly price: number;

  @IsBuffer()
  readonly image: Buffer;

  @IsNumber()
  @Min(0)
  @Max(5)
  @IsOptional()
  readonly rating?: number;

  @IsNumber()
  @Min(0)
  @Max(100)
  @IsOptional()
  readonly discount?: number;

  @ArrayNotEmpty()
  readonly categories: number[];

  @IsNumber()
  @IsOptional()
  @Validate(ProductStatusValidator)
  readonly status: ProductStatuses;
}
