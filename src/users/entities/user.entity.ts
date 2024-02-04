import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { HydratedDocument } from 'mongoose';
import validator from 'validator';

import { Order, OrderDocument } from '../../orders/entities/order.entity';
import { PartialBy } from '../../types/utils';

@Schema()
export class User {
  @Prop({ type: String })
  firstName: string;

  @Prop({ type: String })
  lastName: string;

  @Prop({
    type: String,
    required: true,
    unique: true,
    trim: true,
    minlength: 7,
    validate(value: string): void {
      if (!validator.isMobilePhone(value)) {
        throw new Error('Phone is invalid');
      }
    },
  })
  phoneNumber: string;

  @Prop({
    type: [String],
    required: true,
  })
  tokens: string[];

  generateAuthToken: () => Promise<string[]>;

  orders: OrderDocument[];
}

export const UserEntity = SchemaFactory.createForClass(User);

export type UserDocument = HydratedDocument<User>;

UserEntity.virtual('orders', {
  ref: Order.name,
  localField: '_id',
  foreignField: 'owner',
});

UserEntity.method<UserDocument>('toJSON', function () {
  const user = this.toObject() as PartialBy<UserDocument, 'tokens' | '__v'>;

  delete user.__v;
  delete user.tokens;

  return user;
});
