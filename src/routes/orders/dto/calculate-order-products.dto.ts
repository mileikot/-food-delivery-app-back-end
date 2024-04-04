import { IsInt, IsOptional } from 'class-validator';

import { CheckoutProductDto } from '@/routes/checkout/dto';

export class CalculateOrderProductsDto extends CheckoutProductDto {
  @IsOptional()
  @IsInt()
  id: number | undefined;
}
