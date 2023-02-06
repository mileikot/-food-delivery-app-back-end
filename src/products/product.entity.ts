import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import mongoose, { HydratedDocument } from 'mongoose';
import { ProductCategory } from 'src/product-categories/product-category.entity';
import { PartialBy } from 'src/types';
import { FullProduct } from './types';

@Schema()
export class Product implements FullProduct {
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
    validate(discount: number) {
      if (discount > 100) {
        throw new Error('Discount cannot be bigger than 100%!');
      }
    },
  })
  discount: number;

  @Prop({
    type: Buffer,
    required: true,
  })
  image: Buffer;

  @Prop({
    type: [mongoose.Schema.Types.ObjectId],
    ref: ProductCategory.name,
    validate(categories: string[]) {
      if (categories.length === 0) {
        throw new Error('A product must have at least one category!');
      }
    },
  })
  categories: string[];
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
