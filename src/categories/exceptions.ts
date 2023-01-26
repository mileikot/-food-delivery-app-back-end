import { NotFoundException } from '@nestjs/common';

export class CategoryNotFoundException extends NotFoundException {
  constructor(public id: string | number) {
    super(`A category with the id ${id} doesn't exist`);
  }
}
