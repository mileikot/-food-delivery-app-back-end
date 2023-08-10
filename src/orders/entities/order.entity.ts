import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import mongoose, { HydratedDocument } from 'mongoose';

import { OrderStatuses, orderStatusesMap } from '../types/types';

@Schema()
export class Order {
  @Prop({
    type: String,
    required: true,
    default: orderStatusesMap.PENDING_PAYMENT,
    validate(value) {
      if (!Object.values(orderStatusesMap).includes(value)) {
        throw new Error('Unavailable status');
      }
    },
  })
  status: OrderStatuses;

  @Prop({
    type: Number,
    required: true,
    default: 0,
    validate(value) {
      if (value < 0) {
        throw new Error('Price must be a positive number');
      }
    },
  })
  purchaseTotal: number;

  @Prop({
    type: Date,
    required: true,
    default: Date.now,
  })
  date: Date;

  @Prop({
    type: [mongoose.Schema.Types.ObjectId],
    required: true,
  })
  products: mongoose.Schema.Types.ObjectId[];

  @Prop({
    type: mongoose.Schema.Types.ObjectId,
    requires: true,
    ref: 'User',
  })
  owner: mongoose.Schema.Types.ObjectId;
}

export type OrderDocument = HydratedDocument<Order>;

export const OrderSchema = SchemaFactory.createForClass(Order);
