import { Type } from 'class-transformer';
import { IsString, MaxLength } from 'class-validator';

import { CheckoutProductDto } from '@/routes/checkout/dto';

export class CreateOrderDto {
  @Type(() => CheckoutProductDto)
  products: CheckoutProductDto[];

  @IsString()
  @MaxLength(100)
  comment: string;
}
