import { CanActivate, ExecutionContext, Injectable } from '@nestjs/common';
import { Reflector } from '@nestjs/core';
import { InjectRepository } from '@nestjs/typeorm';
import { Observable } from 'rxjs';
import { Repository } from 'typeorm';

import { User } from '../../users/entities/user.entity';
import { PermissionNames } from '../types';
import { matchPermissions } from '../utils';

import { RequestWithUserPermissions } from '@/types';

@Injectable()
export class PermissionsGuard implements CanActivate {
  constructor(
    private reflector: Reflector,
    @InjectRepository(User) private readonly userRepository: Repository<User>,
  ) {}

  canActivate(
    context: ExecutionContext,
  ): boolean | Promise<boolean> | Observable<boolean> {
    const requiredPermissions = this.reflector.getAllAndOverride<
      PermissionNames[]
    >('permissions', [context.getHandler(), context.getClass()]);

    if (!requiredPermissions) {
      return true;
    }

    const user = context
      .switchToHttp()
      .getRequest<RequestWithUserPermissions>();

    if (!user) {
      return false;
    }

    return matchPermissions(requiredPermissions, user.permissions);
  }
}
