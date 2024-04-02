import { BadRequestException, NotFoundException } from '@nestjs/common';

export class OrderReviewNotFoundException extends NotFoundException {
  constructor() {
    super(`This review doesn't exist`);
  }
}

export class OrderReviewAlreadyExistException extends BadRequestException {
  constructor() {
    super('A review for this order already exists');
  }
}
