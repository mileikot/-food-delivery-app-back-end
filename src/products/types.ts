import { ProductCategory } from 'src/product-categories/product-category.entity';

export interface FullProduct {
  title: string;
  description: string;
  price: number;
  image: Buffer;
  rating: number;
  discount: number;
  categories: string[] | ProductCategory[];
}

export class PopulatedProduct implements FullProduct {
  title: string;
  description: string;
  price: number;
  image: Buffer;
  rating: number;
  discount: number;
  categories: ProductCategory[];
}
