import { Jwt, JwtPayload } from 'jsonwebtoken';

export type JwtPayloadWithIds = Jwt &
  JwtPayload & {
    userId: number | null;
  };
