import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import * as bcrypt from 'bcrypt';
import * as crypto from 'crypto';
import { Repository } from 'typeorm';

import { CreateVerificationCodeDto } from './dto/create-verification-code.dto';
import { VerifyPhoneNumberDto } from './dto/verify-phone-number.dto';
import { BYTES_IN_ONE_SYMBOL, MAX_CODE_SYMBOLS } from './constants';
import { PhoneNumberVerification } from './phone-number-verification.entity';

@Injectable()
export class VerficationPhoneNumbersService {
  constructor(
    @InjectRepository(PhoneNumberVerification)
    private readonly phoneNumberVerificationRepository: Repository<PhoneNumberVerification>,
  ) {}

  async createVerificationCode(
    createVerificationCodeDto: CreateVerificationCodeDto,
  ): Promise<string> {
    const randomBytes = crypto.randomBytes(
      Math.ceil(MAX_CODE_SYMBOLS * BYTES_IN_ONE_SYMBOL),
    );

    const code = randomBytes
      .toString('base64')
      .slice(0, MAX_CODE_SYMBOLS)
      .toUpperCase();

    const hashedCode = await bcrypt.hash(code, 10);

    const { phoneNumber } = createVerificationCodeDto;

    await this.phoneNumberVerificationRepository.save({
      oneTimePassword: hashedCode,
      phoneNumber,
    });

    return code;
  }

  async verifyPhoneNumber(verifyCodeDto: VerifyPhoneNumberDto) {
    const { phoneNumber, code } = verifyCodeDto;

    const dataToVerify = await this.phoneNumberVerificationRepository.findOne({
      where: { phoneNumber },
    });

    if (!dataToVerify) {
      throw new Error("Code wasn't created for this number.");
    }

    const isVerified = bcrypt.compare(code, dataToVerify.oneTimePassword);

    if (isVerified) {
      await this.phoneNumberVerificationRepository.delete({ phoneNumber });
    }

    return isVerified;
  }
}
