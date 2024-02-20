import { NotFoundException } from '@nestjs/common';

export class OrderNotFoundException extends NotFoundException {
  constructor(public id: number) {
    super(`An order with the id ${id} doesn't exist`);
  }
}
