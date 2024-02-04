import { Module } from '@nestjs/common';
import { MongooseModule } from '@nestjs/mongoose';

import { VerficationPhoneNumbersController } from './verification-phone-numbers.controller';
import { VerficationPhoneNumbersService } from './verification-phone-numbers.service';

import { ClientSnsModule } from '@/modules/aws/client-sns';
import { UsersModule } from '@/users/users.module';
import {
  PhoneNumberVerification,
  PhoneNumberVerificationSchema,
} from '@/verification-phone-numbers/entities/phone-number-verification.entity';

@Module({
  imports: [
    MongooseModule.forFeature([
      {
        name: PhoneNumberVerification.name,
        schema: PhoneNumberVerificationSchema,
      },
    ]),
    ClientSnsModule,
    UsersModule,
  ],
  controllers: [VerficationPhoneNumbersController],
  providers: [VerficationPhoneNumbersService],
})
export class VerficationPhoneNumberModule {}
