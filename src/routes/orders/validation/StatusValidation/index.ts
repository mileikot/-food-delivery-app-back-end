import {
  ValidationArguments,
  ValidatorConstraint,
  ValidatorConstraintInterface,
} from 'class-validator';

import { OrderStatuses, orderStatusesList } from '@/routes/orders/statuses';

@ValidatorConstraint({ name: 'OrderStatusValidator' })
export class OrderStatusValidator implements ValidatorConstraintInterface {
  validate(status: OrderStatuses) {
    return orderStatusesList.includes(status);
  }

  defaultMessage(args: ValidationArguments) {
    return `${args.property} must be valid`;
  }
}
