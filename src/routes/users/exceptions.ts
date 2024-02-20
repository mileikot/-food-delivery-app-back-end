import { BadRequestException, NotFoundException } from '@nestjs/common';

export class UserNotFoundException extends NotFoundException {
  constructor() {
    super(`This user doesn't exist`);
  }
}

export class UserAlreadyExistException extends BadRequestException {
  constructor() {
    super('A user with this phone number already exists');
  }
}
