import { Validate } from 'class-validator';

import { OrderStatuses } from '../statuses';
import { OrderStatusValidator } from '../validation';

export class UpdateOrderDto {
  @Validate(OrderStatusValidator)
  status: OrderStatuses;
}
