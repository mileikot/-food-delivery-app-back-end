import {
  Injectable,
  NestMiddleware,
  UnauthorizedException,
} from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import { NextFunction, Response } from 'express';

import { RequestWithUser } from '../types/common';

import { JwtPayloadWithIds } from './types';

import { ManagersService } from '@/routes/managers/managers.service';
import { UserNotFoundException } from '@/routes/users/exceptions';
import { UsersService } from '@/routes/users/users.service';

@Injectable()
export class AuthMiddleware implements NestMiddleware {
  constructor(
    private readonly usersService: UsersService,
    private readonly managersService: ManagersService,
    private readonly jwtService: JwtService,
  ) {}

  async use(req: RequestWithUser, _: Response, next: NextFunction) {
    const token = req.header('Authorization')?.replace('Bearer ', '');

    if (!token) {
      throw new UnauthorizedException();
    }

    const { userId, managerId } = this.jwtService.verify(
      token,
    ) as JwtPayloadWithIds;

    const user = userId
      ? await this.usersService.findOne({
          where: { id: userId },
        })
      : null;

    const manager = managerId
      ? await this.managersService.findOne({
          where: { id: managerId },
        })
      : null;

    if (!user && !manager) {
      throw new UserNotFoundException();
    }

    req.userId = user?.id ?? null;
    req.managerId = manager?.id ?? null;

    next();
  }
}
