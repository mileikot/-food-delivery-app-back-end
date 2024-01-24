import { Request } from 'express';

import { UserDocument } from '../users/entities/user.entity';

export type RequestWithUser = {
  user: UserDocument;
  token: string;
} & Request;

export type TrueBasedMap<T extends string = string> = Record<T, true>;
