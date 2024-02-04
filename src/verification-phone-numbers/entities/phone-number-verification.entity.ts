import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { HydratedDocument } from 'mongoose';
import validator from 'validator';

@Schema()
export class PhoneNumberVerification {
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

  @Prop({ type: String, required: true })
  oneTimePassword: string;
}

export type PhoneNumberVerificationDocument =
  HydratedDocument<PhoneNumberVerification>;

export const PhoneNumberVerificationSchema = SchemaFactory.createForClass(
  PhoneNumberVerification,
);
