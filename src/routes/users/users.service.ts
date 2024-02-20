import { Injectable } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { InjectRepository } from '@nestjs/typeorm';
import * as jwt from 'jsonwebtoken';
import { FindOneOptions, Repository } from 'typeorm';

import { CreateUserDto } from './dto/create-user.dto';
import { LoginUserDto } from './dto/login-user.dto';
import { UpdateUserDto } from './dto/update-user.dto';
import { UserAlreadyExistException, UserNotFoundException } from './exceptions';
import { User } from './user.entity';

import { includeAll } from '@/lib/typeorm';

@Injectable()
export class UsersService {
  constructor(
    private readonly configService: ConfigService,
    @InjectRepository(User) private readonly userRepository: Repository<User>,
  ) {}

  async create(createUserDto: CreateUserDto): Promise<User> {
    const existingUser = await this.userRepository.findOne({
      where: { phoneNumber: createUserDto.phoneNumber },
    });

    if (existingUser) {
      throw new UserAlreadyExistException();
    }

    const user = await this.userRepository.create(createUserDto);

    const token = await this.generateAuthToken(user.id);

    user.tokens = [token];

    const newUser = await this.userRepository.save(user);

    return newUser;
  }

  async login(loginUserDto: LoginUserDto): Promise<User> {
    const user = await this.userRepository.findOne({
      where: { phoneNumber: loginUserDto.phoneNumber },
      select: includeAll(this.userRepository),
    });

    if (user === null) {
      throw new UserNotFoundException();
    }

    const token = await this.generateAuthToken(user.id);

    user.tokens = [token];

    const savedUser = await this.userRepository.save(user);

    return savedUser;
  }

  async findOne(options: FindOneOptions<User>): Promise<User> {
    const user = await this.userRepository.findOne(options);

    if (user === null) {
      throw new UserNotFoundException();
    }

    return user;
  }

  async findOneById(id: number): Promise<User> {
    const user = await this.findOne({
      where: { id },
    });

    if (user === null) {
      throw new UserNotFoundException();
    }

    return user;
  }

  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  update(id: number, updateUserDto: UpdateUserDto) {
    return `This action updates a #${id} user`;
  }

  remove(id: number) {
    return `This action removes a #${id} user`;
  }

  private async generateAuthToken(id: number) {
    const secret = this.configService.get('JWT_SECRET') as jwt.Secret;

    const token: string = jwt.sign({ id }, secret, {
      expiresIn: '365d',
    });

    return token;
  }
}
