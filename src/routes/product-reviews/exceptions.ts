import { NotFoundException } from '@nestjs/common';

export class ProductReviewNotFoundException extends NotFoundException {
  constructor() {
    super(`This review doesn't exist`);
  }
}

export class ProductRatingNotFoundException extends NotFoundException {
  constructor() {
    super(`This review doesn't exist`);
  }
}
