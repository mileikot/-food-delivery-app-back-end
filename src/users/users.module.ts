import { Module } from '@nestjs/common';
import { UsersService } from './users.service';
import { UsersController } from './users.controller';
import { MongooseModule } from '@nestjs/mongoose';
import { userFactory } from './user.factory';

@Module({
  imports: [MongooseModule.forFeatureAsync([userFactory])],
  exports: [MongooseModule],
  controllers: [UsersController],
  providers: [UsersService],
})
export class UsersModule {}
