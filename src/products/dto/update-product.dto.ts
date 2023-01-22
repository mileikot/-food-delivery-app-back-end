import { PartialType } from '@nestjs/mapped-types';
import { CreateProductDto } from './create-product.dto';

export class UpdateProductDto extends PartialType(CreateProductDto) {
  readonly title?: string;
  readonly description?: string;
  readonly price?: number;
  readonly image?: Buffer;
  readonly rating?: number;
  readonly discount?: number;
}
