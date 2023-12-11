import { NotFoundException } from '@nestjs/common';
import { Types } from 'mongoose';

export class ProductNotFoundException extends NotFoundException {
  constructor(public id: Types.ObjectId) {
    super(`A product with the id ${id} doesn't exist`);
  }
}
