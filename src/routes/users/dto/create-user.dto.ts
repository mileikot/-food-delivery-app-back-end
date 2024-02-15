import { IsPhoneNumber, MinLength } from 'class-validator';

export class CreateUserDto {
  @MinLength(2)
  firstName?: string;

  @MinLength(2)
  lastName?: string;

  @IsPhoneNumber()
  phoneNumber: string;
}
