import { IsString, MaxLength, MinLength } from 'class-validator';

import { LoginManagerDto } from '@/routes/auth/dto/login-manager.dto';

export class CreateManagerDto extends LoginManagerDto {
  @IsString()
  @MinLength(2)
  @MaxLength(16)
  firstName: string;

  @IsString()
  @MinLength(2)
  @MaxLength(16)
  lastName: string;
}
