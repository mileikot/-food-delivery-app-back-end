import { Injectable } from '@nestjs/common';
import { CreateUserDto } from './dto/create-user.dto';
import { UpdateUserDto } from './dto/update-user.dto';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { User, UserDocument } from './entities/user.entity';
import { LoginUserDto } from './dto/login-user.dto';

@Injectable()
export class UsersService {
  constructor(
    @InjectModel(User.name) private readonly userModel: Model<UserDocument>,
  ) {}

  async create(createUserDto: CreateUserDto) {
    const newUser = new this.userModel(createUserDto);

    await newUser.save();

    const tokens = await newUser.generateAuthToken();

    return { newUser, tokens };
  }

  async login(
    loginUserDto: LoginUserDto,
  ): Promise<{ user: UserDocument; tokens: string[] }> {
    const user = await this.userModel.findOne({
      phoneNumber: loginUserDto.phoneNumber,
    });

    if (user === null) {
      throw new Error("This Phone number hasn't registered yet");
    }

    const tokens = await user.generateAuthToken();

    return { user, tokens };
  }

  async findOne(id: string) {
    const user = await this.userModel.findOne({ id });

    return user;
  }

  update(id: number, updateUserDto: UpdateUserDto) {
    return `This action updates a #${id} user`;
  }

  remove(id: number) {
    return `This action removes a #${id} user`;
  }
}
