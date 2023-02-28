import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { HydratedDocument } from 'mongoose';
import { PartialBy } from 'src/types';

@Schema()
export class ProductCategory {
  @Prop({
    type: String,
    required: true,
    maxlength: 50,
  })
  name: string;

  @Prop({
    type: String,
    required: true,
    maxlength: 50,
  })
  slug: string;
}

export type ProductCategoryDocument = HydratedDocument<ProductCategory>;

export const ProductCategorySchema =
  SchemaFactory.createForClass(ProductCategory);

ProductCategorySchema.method<ProductCategoryDocument>('toJSON', function () {
  const productCategory = this.toObject() as PartialBy<
    ProductCategoryDocument,
    '__v'
  >;

  delete productCategory.__v;

  return productCategory;
});
