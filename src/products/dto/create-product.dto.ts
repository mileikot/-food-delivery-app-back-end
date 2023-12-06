import { Transform, Type } from 'class-transformer';
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

import { ProductCategory } from '@/product-categories/product-category.entity';

export class CreateProductDto {
  @IsString()
  @MinLength(5)
  readonly title: string;

  @IsString()
  @MaxLength(500)
  readonly description: string;

  @Type(() => Number)
  @IsPositive()
  readonly price: number;

  readonly image: Buffer;

  @Transform(({ value }) => (value === '' ? undefined : Number(value)))
  @IsNumber()
  @Min(1)
  @Max(5)
  @IsOptional()
  readonly rating?: number;

  @Transform(({ value }) => (value === '' ? undefined : Number(value)))
  @IsNumber()
  @Min(0)
  @Max(100)
  @IsOptional()
  readonly discount?: number;

  @Transform(({ value }) => JSON.parse(value))
  @ArrayNotEmpty()
  readonly categories: ProductCategory[];

  @Type(() => Number)
  @Validate(ProductStatusValidator)
  readonly status: ProductStatuses;
}
