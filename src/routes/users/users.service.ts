import { Injectable } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import { InjectRepository } from '@nestjs/typeorm';
import { FindOneOptions, Repository } from 'typeorm';

import { CreateUserDto } from './dto/create-user.dto';
import { UpdateUserDto } from './dto/update-user.dto';
import { UserAlreadyExistException, UserNotFoundException } from './exceptions';
import { User } from './user.entity';

@Injectable()
export class UsersService {
  constructor(
    @InjectRepository(User) private readonly userRepository: Repository<User>,
    private readonly jwtService: JwtService,
  ) {}

  async create(createUserDto: CreateUserDto): Promise<User> {
    const existingUser = await this.userRepository.findOne({
      where: { phoneNumber: createUserDto.phoneNumber },
    });

    if (existingUser) {
      throw new UserAlreadyExistException();
    }

    const newUser = this.userRepository.create(createUserDto);

    const user = await this.userRepository.save(newUser);

    return user;
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
}
