import {
  IsInt,
  IsOptional,
  IsString,
  Max,
  MaxLength,
  Min,
} from 'class-validator';

export class CreateProductReviewDto {
  @IsInt()
  productId: number;

  @IsInt()
  @Max(5)
  @Min(0)
  rating: number;

  @IsString()
  @IsOptional()
  @MaxLength(200)
  comment: string | null;
}
