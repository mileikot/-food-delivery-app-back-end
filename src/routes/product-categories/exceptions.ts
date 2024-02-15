import { NotFoundException } from '@nestjs/common';

export class ProductCategoryNotFoundException extends NotFoundException {
  constructor(public id: number) {
    super(`A category with the id ${id} doesn't exist`);
  }
}
