import { Category } from 'src/categories/entities/category.entity';

export interface FullProduct {
  title: string;
  description: string;
  price: number;
  image: Buffer;
  rating: number;
  discount: number;
  categories: string[] | Category[];
}

export class PopulatedProduct implements FullProduct {
  title: string;
  description: string;
  price: number;
  image: Buffer;
  rating: number;
  discount: number;
  categories: Category[];
}
