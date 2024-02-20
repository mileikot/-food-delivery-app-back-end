import { ProductStatuses } from '../statuses/productStatuses';

import { ProductCategory } from '@/routes/product-categories/product-category.entity';

export class FullProductDto {
  id: number;
  title: string;
  description: string;
  price: number;
  totalPrice: number;
  imageName: string | null;
  imageUrl: string;
  rating: number | null;
  discount: number | null;
  categories: ProductCategory[];
  status: ProductStatuses;
}
