import {
  Body,
  Controller,
  HttpException,
  HttpStatus,
  Post,
} from '@nestjs/common';

import { CreateVerificationCodeDto } from './dto/create-verification-code.dto';
import { VerifyPhoneNumberDto } from './dto/verify-phone-number.dto';
import { VerficationPhoneNumbersService } from './verification-phone-numbers.service';

import { ClientSnsService } from '@/modules/aws/client-sns/client-sns.service';
import { UsersService } from '@/users/users.service';

@Controller('verficationPhoneNumbers')
export class VerficationPhoneNumbersController {
  constructor(
    private readonly clientSnsService: ClientSnsService,
    private readonly verficationPhoneNumbersService: VerficationPhoneNumbersService,
    private readonly usersService: UsersService,
  ) {}

  @Post('/createVerificationCode')
  async createVerificationCode(
    @Body() createVerificationCodeDto: CreateVerificationCodeDto,
  ) {
    try {
      const code =
        await this.verficationPhoneNumbersService.createVerificationCode(
          createVerificationCodeDto,
        );
      return await this.clientSnsService.sendSms(
        createVerificationCodeDto,
        code,
      );
    } catch (e) {
      throw new HttpException(e.message, HttpStatus.NOT_FOUND);
    }
  }

  @Post('/verifyPhoneNumber')
  async verifyPhoneNumber(@Body() verifyPhoneNumberDto: VerifyPhoneNumberDto) {
    try {
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
    } catch (e) {
      throw new HttpException(e.message, HttpStatus.NOT_FOUND);
    }
  }
}
