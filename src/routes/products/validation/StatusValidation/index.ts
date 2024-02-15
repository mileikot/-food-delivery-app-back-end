import {
  ValidationArguments,
  ValidatorConstraint,
  ValidatorConstraintInterface,
} from 'class-validator';

import { productStatusesList } from '@/routes/products/statuses/hardcoded';
import { ProductStatuses } from '@/routes/products/statuses/productStatuses';

@ValidatorConstraint({ name: 'ProductStatusValidator' })
export class ProductStatusValidator implements ValidatorConstraintInterface {
  validate(status: ProductStatuses) {
    return productStatusesList.includes(status);
  }

  defaultMessage(args: ValidationArguments) {
    return `${args.property} must be valid`;
  }
}
