import { IsPhoneNumber } from 'class-validator';

export class LoginUserDto {
  @IsPhoneNumber()
  phoneNumber: string;
}
