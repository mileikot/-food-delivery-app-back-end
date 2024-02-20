import { Jwt, JwtPayload } from 'jsonwebtoken';

export type UserJwtPayload = {
  id: number;
} & Jwt &
  JwtPayload &
  void;
