import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { HydratedDocument } from 'mongoose';

@Schema()
export class Category {
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

export type CategoryDocument = HydratedDocument<Category>;

export const CategorySchema = SchemaFactory.createForClass(Category);
