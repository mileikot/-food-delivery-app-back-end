import { IsPhoneNumber } from 'class-validator';

export class VerifyPhoneNumberDto {
  @IsPhoneNumber()
  phoneNumber: string;
  code: string;
}
