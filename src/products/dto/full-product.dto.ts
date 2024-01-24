import { Types } from 'mongoose';

import { ProductStatuses } from '../statuses/productStatuses';

import { ProductCategory } from '@/product-categories/product-category.entity';

export class FullProductDto {
  _id: Types.ObjectId;
  title: string;
  description: string;
  price: number;
  totalPrice: number;
  imageName: string;
  imageUrl: string;
  rating: number;
  discount: number;
  categories: string[] | ProductCategory[];
  status: ProductStatuses;
}
