import { Type } from 'class-transformer';
import {
  ArrayNotEmpty,
  IsArray,
  Validate,
  ValidateNested,
} from 'class-validator';

import { OrderStatuses } from '../statuses';
import { OrderStatusValidator } from '../validation';

import { CalculateOrderProductsDto } from './calculate-order-products.dto';

export class UpdateOrderDto {
  @Validate(OrderStatusValidator)
  status: OrderStatuses;

  @IsArray()
  @ArrayNotEmpty()
  @Type(() => CalculateOrderProductsDto)
  @ValidateNested({ each: true })
  products: CalculateOrderProductsDto[];
}
