import { ProductCategory } from 'src/product-categories/product-category.entity';

import { ProductStatuses } from './statuses/productStatuses';

export abstract class FullProduct {
  title: string;
  description: string;
  price: number;
  image: Buffer;
  rating: number;
  discount: number;
  categories: string[] | ProductCategory[];
  status: ProductStatuses;
}

export abstract class PopulatedProduct extends FullProduct {
  // title: string;
  // description: string;
  // price: number;
  // image: Buffer;
  // rating: number;
  // discount: number;
  categories: ProductCategory[];
}
