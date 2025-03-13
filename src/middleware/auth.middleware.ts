import {
  Injectable,
  NestMiddleware,
  UnauthorizedException,
} from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import { NextFunction, Response } from 'express';

import { RequestWithUserPermissions } from '../types/common';

import { JwtPayloadWithIds } from './types';
import { getPermissionsArrayFromRoles } from './utils';

import { UserNotFoundException } from '@/routes/users/exceptions';
import { UsersService } from '@/routes/users/users.service';

@Injectable()
export class AuthMiddleware implements NestMiddleware {
  constructor(
    private readonly usersService: UsersService,
    private readonly jwtService: JwtService,
  ) {}

  async use(req: RequestWithUserPermissions, _: Response, next: NextFunction) {
    const token = req.header('Authorization')?.replace('Bearer ', '');

    if (!token) {
      throw new UnauthorizedException();
    }

    const { userId } = this.jwtService.verify(token) as JwtPayloadWithIds;

    const user = userId
      ? await this.usersService.findOne({
          where: { id: userId },
          relations: ['roles', 'roles.permissions'],
        })
      : null;

    if (!user) {
      throw new UserNotFoundException();
    }

    req.userId = user?.id ?? null;
    req.permissions = user?.roles
      ? getPermissionsArrayFromRoles(user?.roles)
      : null;

    next();
  }
}
