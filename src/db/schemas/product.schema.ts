import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { HydratedDocument } from 'mongoose';

@Schema()
export class Product {
  @Prop({
    type: String,
    required: true,
    minlength: 10,
  })
  title: string;

  @Prop({
    type: String,
    required: true,
    maxlength: 500,
  })
  description: string;

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

  @Prop({
    type: Number,
    validate(value) {
      if (value > 5) {
        throw new Error('Rating cannot be bigger than 5');
      }
    },
  })
  rating: number;

  @Prop(Number)
  discount: number;

  @Prop({
    type: Buffer,
    required: true,
  })
  image: Buffer;
}

export type ProductDocument = HydratedDocument<Product>;

export const ProductSchema = SchemaFactory.createForClass(Product);

ProductSchema.method<ProductDocument>('toJSON', function () {
  const product = this.toObject();
  delete product.image;
  return product;
});
