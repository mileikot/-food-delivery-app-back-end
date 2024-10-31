import { Type } from 'class-transformer';
import { ArrayNotEmpty, IsArray, ValidateNested } from 'class-validator';

import { CheckoutProductDto } from './checkout-product.dto';

export class CheckoutCalculationDto {
  @IsArray()
  @ArrayNotEmpty()
  @ValidateNested({ each: true })
  @Type(() => CheckoutProductDto)
  readonly products: CheckoutProductDto[];
}
