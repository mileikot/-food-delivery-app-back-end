import { Jwt, JwtPayload } from 'jsonwebtoken';
import mongoose from 'mongoose';

export type UserJwtPayload = {
  _id: mongoose.Schema.Types.ObjectId;
} & Jwt &
  JwtPayload &
  void;
