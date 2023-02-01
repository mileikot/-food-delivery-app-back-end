import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import mongoose, { HydratedDocument } from 'mongoose';
import { PartialBy } from 'src/types';
import { Category } from '../../categories/entities/category.schema';

@Schema()
export class Product {
  @Prop({
    type: String,
    required: true,
    minlength: 5,
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
        throw new Error('Rating cannot be bigger than 5!');
      }
    },
  })
  rating: number;

  @Prop({
    type: Number,
    max: 100,
  })
  discount: number;

  @Prop({
    type: Buffer,
    required: true,
  })
  image: Buffer;

  @Prop({
    type: [mongoose.Schema.Types.ObjectId],
    ref: Category.name,
    validate(categories: string[]) {
      if (categories.length === 0) {
        throw new Error('A product must have at least one category!');
      }
    },
  })
  categories: string[] | Category[];
}

export type ProductDocument = HydratedDocument<Product>;

export const ProductSchema = SchemaFactory.createForClass(Product);

ProductSchema.method<ProductDocument>('toJSON', function () {
  const product = this.toObject() as PartialBy<
    ProductDocument,
    'image' | '__v'
  >;

  delete product.__v;
  delete product.image;

  return product;
});
