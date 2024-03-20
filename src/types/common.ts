import { HttpStatus } from '@nestjs/common';
import { Request } from 'express';

export type RequestWithUser = {
  userId: number | null;
  managerId: number | null;
} & Request;

export type TrueBasedMap<T extends string = string> = Record<T, true>;

export interface ResponseWithoutData {
  message: string;
  statusCode: HttpStatus;
}
