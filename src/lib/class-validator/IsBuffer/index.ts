import {
  registerDecorator,
  ValidationArguments,
  ValidatorConstraintInterface,
} from 'class-validator';

export class BufferConstraint implements ValidatorConstraintInterface {
  validate(value: Buffer): boolean {
    return Buffer.isBuffer(value);
  }

  defaultMessage(args: ValidationArguments) {
    return `${args.property} is not a buffer`;
  }
}

export const IsBuffer = () => {
  return (object: any, propertyName: string) => {
    registerDecorator({
      target: object.constructor,
      propertyName: propertyName,
      validator: BufferConstraint,
    });
  };
};
