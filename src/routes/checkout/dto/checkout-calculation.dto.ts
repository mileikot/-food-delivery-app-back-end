import { plainToInstance, Transform } from 'class-transformer';
import { ArrayNotEmpty, IsArray, ValidateNested } from 'class-validator';

import { CheckoutProductDto } from './checkout-product.dto';

export class CheckoutCalculationDto {
  @IsArray()
  @ArrayNotEmpty()
  @ValidateNested({ each: true })
  @Transform(({ value }) =>
    plainToInstance(CheckoutProductDto, JSON.parse(value)),
  )
  readonly products: CheckoutProductDto[];
}
