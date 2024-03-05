import { Type } from 'class-transformer';
import {
  ArrayNotEmpty,
  IsArray,
  IsOptional,
  IsString,
  MaxLength,
  ValidateNested,
} from 'class-validator';

import { CheckoutProductDto } from '@/routes/checkout/dto';

export class CreateOrderDto {
  @IsArray()
  @ArrayNotEmpty()
  @Type(() => CheckoutProductDto)
  @ValidateNested({ each: true })
  products: CheckoutProductDto[];

  @IsString()
  @IsOptional()
  @MaxLength(100)
  comment: string;
}
