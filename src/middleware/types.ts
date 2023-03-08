import mongoose from 'mongoose';
import { Jwt, JwtPayload } from 'jsonwebtoken';

export type UserJwtPayload = {
  _id: mongoose.Schema.Types.ObjectId;
} & Jwt &
  JwtPayload &
  void;
