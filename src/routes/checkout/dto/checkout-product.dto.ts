import { IsInt, Max, Min } from 'class-validator';

export class CheckoutProductDto {
  @IsInt()
  readonly productId: number;

  @IsInt()
  @Min(1)
  @Max(100)
  readonly quantity: number;
}
