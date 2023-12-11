import { ProductCategory } from 'src/product-categories/product-category.entity';

import { ProductStatuses } from './statuses/productStatuses';

export abstract class FullProduct {
  title: string;
  description: string;
  price: number;
  imageName: string;
  rating: number;
  discount: number;
  categories: string[] | ProductCategory[];
  status: ProductStatuses;
}

export abstract class PopulatedProduct extends FullProduct {
  categories: ProductCategory[];
}
