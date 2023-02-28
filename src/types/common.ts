import { UserDocument } from '../users/entities/user.entity';
import { Request } from 'express';

export type RequestWithUser = {
  user: UserDocument;
  token: string;
} & Request;
