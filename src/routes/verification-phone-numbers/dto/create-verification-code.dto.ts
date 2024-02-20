import { IsMobilePhone } from 'class-validator';

export class CreateVerificationCodeDto {
  @IsMobilePhone()
  phoneNumber: string;
}
