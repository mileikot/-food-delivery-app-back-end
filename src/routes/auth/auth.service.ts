import { Injectable } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import * as bcrypt from 'bcrypt';

import {
  InvalidCredentialsException,
  ManagerNotFoundException,
} from '../managers/exceptions';
import { ManagersService } from '../managers/managers.service';
import { UserNotFoundException } from '../users/exceptions';
import { UsersService } from '../users/users.service';

import { LoginManagerDto } from './dto/login-manager.dto';
import { LoginUserDto } from './dto/login-user.dto';
import { TokenDto } from './dto/token.dto';

@Injectable()
export class AuthService {
  constructor(
    private readonly usersService: UsersService,
    private readonly managerService: ManagersService,
    private readonly jwtService: JwtService,
  ) {}

  async loginUser(loginUserDto: LoginUserDto): Promise<TokenDto> {
    const user = await this.usersService.findOne({
      where: { phoneNumber: loginUserDto.phoneNumber },
    });

    if (user === null) {
      throw new UserNotFoundException();
    }

    const token = await this.jwtService.signAsync({
      userId: user.id,
    });

    return {
      accessToken: token,
    };
  }

  async loginManager(loginManagerDto: LoginManagerDto): Promise<TokenDto> {
    const manager = await this.managerService.findOne({
      where: { email: loginManagerDto.email },
      select: ['password', 'id'],
    });

    if (manager === null) {
      throw new ManagerNotFoundException();
    }

    const passwordIsValid = await bcrypt.compare(
      loginManagerDto.password,
      manager.password,
    );

    if (!passwordIsValid) {
      throw new InvalidCredentialsException();
    }

    const token = await this.jwtService.signAsync({
      managerId: manager.id,
    });

    return {
      accessToken: token,
    };
  }
}
