import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { FindOneOptions, Repository } from 'typeorm';

import { UserNotFoundException } from '../users/exceptions';

import { Permission } from './entities/permission.entity';

@Injectable()
export class PermissionsService {
  constructor(
    @InjectRepository(Permission)
    private readonly PermossionRepository: Repository<Permission>,
  ) {}

  findOne(options: FindOneOptions<Permission>): Promise<Permission | null> {
    const permission = this.PermossionRepository.findOne(options);

    if (permission === null) {
      throw new UserNotFoundException();
    }

    return permission;
  }

  findOneById(id: number): Promise<Permission | null> {
    return this.findOne({ where: { id } });
  }
}
