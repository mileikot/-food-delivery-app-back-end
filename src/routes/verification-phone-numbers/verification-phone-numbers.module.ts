import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';

import { PhoneNumberVerification } from './phone-number-verification.entity';
import { VerficationPhoneNumbersController } from './verification-phone-numbers.controller';
import { VerficationPhoneNumbersService } from './verification-phone-numbers.service';

import { ClientSnsModule } from '@/modules/aws/client-sns';
import { UsersModule } from '@/routes/users/users.module';

@Module({
  imports: [
    TypeOrmModule.forFeature([PhoneNumberVerification]),
    ClientSnsModule,
    UsersModule,
  ],
  controllers: [VerficationPhoneNumbersController],
  providers: [VerficationPhoneNumbersService],
})
export class VerficationPhoneNumberModule {}
