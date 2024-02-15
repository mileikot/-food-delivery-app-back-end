import { IsString, MaxLength } from 'class-validator';

export class CreateProductCategoryDto {
  @IsString()
  @MaxLength(50)
  name: string;

  @IsString()
  @MaxLength(50)
  slug: string;
}
