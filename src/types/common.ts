import { HttpStatus } from '@nestjs/common';
import { Request } from 'express';

import { PermissionNames } from '../routes/permissions/types';

export type RequestWithUser = {
  userId: number | null;
} & Request;

export type RequestWithUserPermissions = {
  permissions: PermissionNames[] | null;
} & RequestWithUser;

export type TrueBasedMap<T extends string = string> = Record<T, true>;

export interface ResponseWithoutData {
  message: string;
  statusCode: HttpStatus;
}
