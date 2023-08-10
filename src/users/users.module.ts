import { Module } from '@nestjs/common';
import { MongooseModule } from '@nestjs/mongoose';

import { userFactory } from './user.factory';
import { UsersController } from './users.controller';
import { UsersService } from './users.service';

@Module({
  imports: [MongooseModule.forFeatureAsync([userFactory])],
  exports: [MongooseModule],
  controllers: [UsersController],
  providers: [UsersService],
})
export class UsersModule {}
