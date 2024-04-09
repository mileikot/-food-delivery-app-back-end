import { BadRequestException, NotFoundException } from '@nestjs/common';

export class ProductCategoryNotFoundException extends NotFoundException {
  constructor() {
    super(`A category with this id doesn't exist`);
  }
}

export class ProductCategoryAlreadyExistsException extends BadRequestException {
  constructor() {
    super(`The category with this name already exists`);
  }
}
