import { IsInt, IsOptional, IsString, Max, MaxLength } from 'class-validator';

export class CreateOrderReviewDto {
  @IsInt()
  orderId: number;

  @IsInt()
  @Max(5)
  rating: number;

  @IsString()
  @IsOptional()
  @MaxLength(200)
  comment: string | null;
}
