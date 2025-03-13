import {
  CanActivate,
  ExecutionContext,
  Injectable,
  UnauthorizedException,
} from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { Reflector } from '@nestjs/core';
import { JwtService } from '@nestjs/jwt';

import { getIsPublic, getJwtPayload } from '../utils';

import { RequestWithUser } from '@/types';

@Injectable()
export class AuthGuard implements CanActivate {
  constructor(
    private jwtService: JwtService,
    private configService: ConfigService,
    private reflector: Reflector,
  ) {}

  async canActivate(context: ExecutionContext): Promise<boolean> {
    const isPublic = getIsPublic(this.reflector, context);

    if (isPublic) {
      return true;
    }

    const request = context.switchToHttp().getRequest<RequestWithUser>();

    const { managerId, userId } = await getJwtPayload(
      request,
      this.jwtService,
      this.configService.get<string>('JWT_SECRET'),
    );

    request.userId = userId;

    if (!managerId && !userId) {
      throw new UnauthorizedException();
    }

    return true;
  }
}
