import { Type } from 'class-transformer';
import {
  ArrayNotEmpty,
  IsArray,
  IsOptional,
  IsString,
  MaxLength,
  ValidateNested,
} from 'class-validator';

import { CalculateOrderProductsDto } from './calculate-order-products.dto';

export class CreateOrderDto {
  @IsArray()
  @ArrayNotEmpty()
  @Type(() => CalculateOrderProductsDto)
  @ValidateNested({ each: true })
  products: CalculateOrderProductsDto[];

  @IsString()
  @IsOptional()
  @MaxLength(100)
  comment: string;
}
