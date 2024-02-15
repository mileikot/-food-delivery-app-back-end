import {
  Injectable,
  NestMiddleware,
  UnauthorizedException,
} from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { NextFunction, Response } from 'express';
import * as jwt from 'jsonwebtoken';
import { ArrayContains } from 'typeorm';

import { RequestWithUser } from '../types/common';

import { UserJwtPayload } from './types';

import { UserNotFoundException } from '@/routes/users/exceptions';
import { UsersService } from '@/routes/users/users.service';

@Injectable()
export class AuthMiddleware implements NestMiddleware {
  constructor(
    private readonly usersService: UsersService,
    readonly configService: ConfigService,
  ) {}

  async use(req: RequestWithUser, _: Response, next: NextFunction) {
    const token = req.header('Authorization')?.replace('Bearer ', '');

    if (!token) {
      throw new UnauthorizedException();
    }

    const decoded = jwt.verify(
      token,
      this.configService.get('JWT_SECRET') as jwt.Secret,
    ) as UserJwtPayload;

    const user = await this.usersService.findOne({
      where: { id: decoded.id, tokens: ArrayContains([token]) },
    });

    if (!user) {
      throw new UserNotFoundException();
    }

    req.token = token;
    req.user = user;

    next();
  }
}
