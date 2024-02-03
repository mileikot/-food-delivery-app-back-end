import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import * as bcrypt from 'bcrypt';
import * as crypto from 'crypto';
import { Model } from 'mongoose';

import { CreateVerificationCodeDto } from './dto/create-verification-code.dto';
import { VerifyPhoneNumberDto } from './dto/verify-phone-number.dto';
import {
  PhoneNumberVerification,
  PhoneNumberVerificationDocument,
} from './entities/phoneNumber.entity';

@Injectable()
export class VerficationPhoneNumbersService {
  constructor(
    @InjectModel(PhoneNumberVerification.name)
    private readonly phoneNumberVerificationModel: Model<PhoneNumberVerificationDocument>,
  ) {}

  async createVerificationCode(
    createVerificationCodeDto: CreateVerificationCodeDto,
  ): Promise<string> {
    const randomBytes = crypto.randomBytes(Math.ceil(6 * 0.75));
    const code = randomBytes.toString('base64').slice(0, 6).toUpperCase();

    const hashedCode = await bcrypt.hash(code, 10);

    const { phoneNumber } = createVerificationCodeDto;

    const PhoneNumberVerification = new this.phoneNumberVerificationModel({
      oneTimePassword: hashedCode,
      phoneNumber,
    });

    await PhoneNumberVerification.save();

    return code;
  }

  async verifyPhoneNumber(verifyCodeDto: VerifyPhoneNumberDto) {
    const { phoneNumber, code } = verifyCodeDto;

    const dataToVerify = await this.phoneNumberVerificationModel
      .findOne({
        phoneNumber,
      })
      .exec();

    if (!dataToVerify) {
      throw new Error("Code wasn't created for this number.");
    }

    const isVerified = bcrypt.compare(code, dataToVerify.oneTimePassword);

    if (isVerified) {
      await this.phoneNumberVerificationModel.deleteOne({ phoneNumber });
    }

    return isVerified;
  }
}
