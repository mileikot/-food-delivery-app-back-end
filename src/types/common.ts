import { Request } from 'express';

import { User } from '@/routes/users/user.entity';

export type RequestWithUser = {
  user: User;
  token: string;
} & Request;

export type TrueBasedMap<T extends string = string> = Record<T, true>;
