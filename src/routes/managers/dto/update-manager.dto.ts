import { IsString, MaxLength, MinLength } from 'class-validator';

export class UpdateManagerDto {
  @IsString()
  @MinLength(2)
  @MaxLength(16)
  firstName: string;

  @IsString()
  @MinLength(2)
  @MaxLength(16)
  lastName: string;
}
