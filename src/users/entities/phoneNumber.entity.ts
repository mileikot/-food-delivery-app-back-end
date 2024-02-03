import { Prop, Schema } from '@nestjs/mongoose';
import { HydratedDocument } from 'mongoose';

@Schema()
export class PhoneNumbersEntity {
  @Prop({ type: String, required: true })
  phoneNumber: string;

  @Prop({ type: String, required: true })
  oneTimePassword: number;
}

export type UserDocument = HydratedDocument<PhoneNumbersEntity>;
