import { FullProductDto } from './full-product.dto';

import { ProductCategory } from '@/routes/product-categories/product-category.entity';

export class PopulatedProductDto extends FullProductDto {
  categories: ProductCategory[];
}
