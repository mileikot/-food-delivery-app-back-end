import { Module } from '@nestjs/common';
import { MongooseModule } from '@nestjs/mongoose';

import { userFactory } from './user.factory';
import { UsersController } from './users.controller';
import { UsersService } from './users.service';

import {
  PhoneNumberVerification,
  PhoneNumberVerificationSchema,
} from '@/verification-phone-numbers/entities/phoneNumber.entity';

@Module({
  imports: [
    MongooseModule.forFeatureAsync([userFactory]),
    MongooseModule.forFeature([
      {
        name: PhoneNumberVerification.name,
        schema: PhoneNumberVerificationSchema,
      },
    ]),
  ],
  exports: [MongooseModule, UsersService],
  controllers: [UsersController],
  providers: [UsersService],
})
export class UsersModule {}
