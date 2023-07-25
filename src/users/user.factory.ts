import { ConfigService } from '@nestjs/config';
import { AsyncModelFactory } from '@nestjs/mongoose';
import * as jwt from 'jsonwebtoken';

import { User, UserDocument, UserEntity } from './entities/user.entity';

export const userFactory: AsyncModelFactory = {
  name: User.name,
  useFactory: (configService: ConfigService) => {
    UserEntity.method<UserDocument>(
      'generateAuthToken',
      async function (): Promise<string[]> {
        const secret = configService.get('JWT_SECRET') as jwt.Secret;

        const token: string = jwt.sign({ _id: this._id.toString() }, secret, {
          expiresIn: '1h',
        });

        this.tokens = this.tokens.concat(token);
        await this.save();

        return this.tokens;
      },
    );
    return UserEntity;
  },
  inject: [ConfigService],
};
