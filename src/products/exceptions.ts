import { NotFoundException } from '@nestjs/common';

export class ProductNotFoundException extends NotFoundException {
  constructor(public id: string | number) {
    super(`A product with the id ${id} doesn't exist`);
  }
}
