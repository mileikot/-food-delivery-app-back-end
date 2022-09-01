import {Prop, Schema, SchemaFactory} from "@nestjs/mongoose";
import validator from 'validator';

@Schema()
export class User {
    @Prop({type: String, required: true})
    firstName: string;

    @Prop({type: String, required: true})
    lastName: string;

    @Prop({
        type: String,
        required: true,
        unique: true,
        trim: true,
        minlength: 7,
        validate(value: string): void {
            if (!validator.isMobilePhone(value)) {
                throw new Error("Phone is invalid");
            }
        }
    })
    phoneNumber: number;

    @Prop({
        type: [String],
        required: true
    })
    tokens: string[]
}

export const UserSchema = SchemaFactory.createForClass(User);