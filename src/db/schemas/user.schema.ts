import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import validator from 'validator';
import * as jwt from 'jsonwebtoken';
import { HydratedDocument, Document } from 'mongoose';

export type UserDocument = HydratedDocument<User>;

@Schema()
export class User extends Document {
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

UserSchema.methods.toJSON = function () {
  const userObject: UserDocument = this.toObject();

  delete userObject.tokens;

  return userObject;
};

UserSchema.methods.generateAuthToken = async function (): Promise<string> {
  const token: string = jwt.sign(
    { _id: this._id.toString() },
    process.env.JWT_SECRET,
    {
      expiresIn: '1h',
    },
  );

  this.tokens = this.tokens.concat(token);
  await this.save();

  return token;
};
