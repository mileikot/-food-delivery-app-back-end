import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { Document } from 'mongoose';

export type ProductDocument = Product & Document;

@Schema()
export class Product {
  @Prop({
    type: String,
    required: true,
    minlength: 10,
  })
  title: string;

  @Prop({
    type: Number,
    required: true,
    validate(value) {
      if (value < 0) {
        throw new Error('Price cannot be less than 0');
      }
    },
  })
  price: number;

  @Prop({
    type: Number,
    required: true,
    validate(value) {
      if (value < 0) {
        throw new Error('Price cannot be less than 0');
      }
    },
  })
  totalPrice: number;

  @Prop(Number)
  rating: number;

  @Prop(Number)
  discount: number;

  @Prop({
    type: Buffer,
    required: true,
  })
  image: Buffer;
}

export const ProductSchema = SchemaFactory.createForClass(Product);
