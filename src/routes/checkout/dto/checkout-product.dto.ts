import { IsInt, Max, Min } from 'class-validator';

export class CheckoutProductDto {
  @IsInt()
  readonly id: number;

  @Min(1)
  @Max(100)
  readonly quantity: number;
}
