import { IsInt, Max, Min } from 'class-validator';

export class CreateProductRatingDto {
  @IsInt()
  productId: number;

  @IsInt()
  @Max(5)
  @Min(0)
  rating: number;
}
