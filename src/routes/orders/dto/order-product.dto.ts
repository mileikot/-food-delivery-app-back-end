import {
  IsInt,
  IsPositive,
  IsString,
  Max,
  MaxLength,
  Min,
  MinLength,
} from 'class-validator';

export class OrderProductDto {
  @IsInt()
  readonly id: number;

  @IsString()
  @MinLength(5)
  readonly title: string;

  @IsString()
  @MaxLength(500)
  readonly description: string;

  @IsPositive()
  readonly price: number;

  @Min(1)
  @Max(100)
  readonly quantity: number;
}
