import { Type } from 'class-transformer';
import {
  ArrayNotEmpty,
  IsArray,
  Validate,
  ValidateNested,
} from 'class-validator';

import { OrderStatuses } from '../statuses';
import { OrderStatusValidator } from '../validation';

import { CheckoutProductDto } from '@/routes/checkout/dto';

export class UpdateOrderDto {
  @Validate(OrderStatusValidator)
  status: OrderStatuses;

  @IsArray()
  @ArrayNotEmpty()
  @Type(() => CheckoutProductDto)
  @ValidateNested({ each: true })
  products: CheckoutProductDto[];
}
