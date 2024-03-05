import { Body, Controller, Post } from '@nestjs/common';

import { CreateVerificationCodeDto } from './dto/create-verification-code.dto';
import { VerifyPhoneNumberDto } from './dto/verify-phone-number.dto';
import { VerficationPhoneNumbersService } from './verification-phone-numbers.service';

import { ClientSnsService } from '@/modules/aws/client-sns';
import { UsersService } from '@/routes/users/users.service';

@Controller('verficationPhoneNumbers')
export class VerficationPhoneNumbersController {
  constructor(
    private readonly clientSnsService: ClientSnsService,
    private readonly verficationPhoneNumbersService: VerficationPhoneNumbersService,
    private readonly usersService: UsersService,
  ) {}

  @Post('/createVerificationCode')
  async createVerificationCode(
    @Body()
    createVerificationCodeDto: CreateVerificationCodeDto,
  ) {
    const code =
      await this.verficationPhoneNumbersService.createVerificationCode(
        createVerificationCodeDto,
      );

    return this.clientSnsService.sendSms(createVerificationCodeDto, code);
  }

  @Post('/verifyPhoneNumber')
  async verifyPhoneNumber(@Body() verifyPhoneNumberDto: VerifyPhoneNumberDto) {
    const isVerified =
      await this.verficationPhoneNumbersService.verifyPhoneNumber(
        verifyPhoneNumberDto,
      );

    if (isVerified) {
      const user = await this.usersService.create({
        phoneNumber: verifyPhoneNumberDto.phoneNumber,
      });

      return {
        user,
        isVerified,
      };
    }

    return {
      user: {},
      isVerified,
    };
  }
}
