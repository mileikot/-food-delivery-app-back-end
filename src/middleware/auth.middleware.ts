import { Injectable, NestMiddleware } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { InjectModel } from '@nestjs/mongoose';
import { NextFunction, Response } from 'express';
import * as jwt from 'jsonwebtoken';
import { Model } from 'mongoose';

import { RequestWithUser } from '../types/common';
import { User, UserDocument } from '../users/entities/user.entity';

import { UserJwtPayload } from './types';

@Injectable()
export class AuthMiddleware implements NestMiddleware {
  constructor(
    @InjectModel(User.name) private readonly userModel: Model<UserDocument>,
    readonly configService: ConfigService,
  ) {}

  async use(req: RequestWithUser, _: Response, next: NextFunction) {
    const token = req.header('Authorization')!.replace('Bearer ', '');
    if (!token) {
      throw new Error();
    }

    const decoded = jwt.verify(
      token,
      this.configService.get('JWT_SECRET') as jwt.Secret,
    ) as UserJwtPayload;

    const user = await this.userModel.findOne({
      _id: decoded._id,
      tokens: token,
    });

    if (!user) {
      throw new Error();
    }

    req.token = token;
    req.user = user;
    next();
  }
}
