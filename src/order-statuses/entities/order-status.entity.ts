import { Prop, Schema } from '@nestjs/mongoose';
import { OrderStatuses, orderStatusesMap } from '../../orders/types/types';

@Schema()
export class OrderStatus {
  @Prop({
    type: String,
    default: orderStatusesMap.PENDING_PAYMENT,
  })
  statusName: OrderStatuses;
}
