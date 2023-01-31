import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import validator from 'validator';
import * as jwt from 'jsonwebtoken';
import { HydratedDocument } from 'mongoose';
import { ConfigService } from '@nestjs/config';
import { PartialBy } from 'src/types';

@Schema()
export class User {
  constructor(readonly configService: ConfigService) {}

  @Prop({ type: String, required: true })
  firstName: string;

  @Prop({ type: String, required: true })
  lastName: string;

  @Prop({
    type: String,
    required: true,
    unique: true,
    trim: true,
    minlength: 7,
    validate(value: string): void {
      if (!validator.isMobilePhone(value)) {
        throw new Error('Phone is invalid');
      }
    },
  })
  phoneNumber: string;

  @Prop({
    type: [String],
    required: true,
  })
  tokens: string[];

  generateAuthToken: () => Promise<string>;
}

export const UserSchema = SchemaFactory.createForClass(User);

export type UserDocument = HydratedDocument<User>;

UserSchema.method<UserDocument>('toJSON', function () {
  const user = this.toObject() as PartialBy<UserDocument, 'tokens' | '__v'>;

  delete user.__v;
  delete user.tokens;

  return user;
});

UserSchema.method<UserDocument>(
  'generateAuthToken',
  async function (): Promise<string> {
    const secret = this.configService.get('JWT_SECRET') as jwt.Secret;

    const token: string = jwt.sign({ _id: this._id.toString() }, secret, {
      expiresIn: '1h',
    });

    this.tokens = this.tokens.concat(token);
    await this.save();

    return token;
  },
);
