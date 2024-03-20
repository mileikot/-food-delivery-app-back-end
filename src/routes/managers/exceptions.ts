import { BadRequestException, NotFoundException } from '@nestjs/common';

export class ManagerNotFoundException extends NotFoundException {
  constructor() {
    super(`This manager doesn't exist`);
  }
}

export class ManagerAlreadyExistException extends BadRequestException {
  constructor() {
    super('A manager with this email already exists');
  }
}

export class InvalidCredentialsException extends BadRequestException {
  constructor() {
    super('Invalid credentials');
  }
}
