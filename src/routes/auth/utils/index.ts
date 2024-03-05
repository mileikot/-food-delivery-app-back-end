import { ExecutionContext, UnauthorizedException } from '@nestjs/common';
import { Reflector } from '@nestjs/core';
import { JwtService } from '@nestjs/jwt';

import { IS_PUBLIC_KEY } from '../decorators';
import { JwtPayloadWithIds } from '../types';

import { RequestWithUser } from '@/types';

export const getIsPublic = (
  reflector: Reflector,
  context: ExecutionContext,
) => {
  return reflector.getAllAndOverride<boolean>(IS_PUBLIC_KEY, [
    context.getHandler(),
    context.getClass(),
  ]);
};

export const getJwtPayload = async (
  request: RequestWithUser,
  jwtService: JwtService,
  secret: string | undefined,
) => {
  const token = request.header('Authorization')?.replace('Bearer ', '');

  if (!token) {
    throw new UnauthorizedException();
  }

  const payload: JwtPayloadWithIds = await jwtService.verifyAsync(token, {
    secret,
  });

  return payload;
};
