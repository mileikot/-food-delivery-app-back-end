import { HttpStatus, Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import * as bcrypt from 'bcrypt';
import { FindManyOptions, FindOneOptions, Repository } from 'typeorm';

import { CreateManagerDto } from './dto/create-manager.dto';
import { ResetPasswordDto } from './dto/reset-password.dto';
import { UpdateManagerDto } from './dto/update-manager.dto';
import { Manager } from './entities/manager.entity';
import {
  ManagerAlreadyExistException,
  ManagerNotFoundException,
} from './exceptions';

import { HttpResponse } from '@/common';
import { deleteProperties } from '@/utils';

@Injectable()
export class ManagersService {
  constructor(
    @InjectRepository(Manager)
    private readonly managersRepository: Repository<Manager>,
  ) {}

  async create(createManagerDto: CreateManagerDto): Promise<Manager> {
    const existingManager = await this.managersRepository.findOne({
      where: { email: createManagerDto.email },
    });

    if (existingManager) {
      throw new ManagerAlreadyExistException();
    }

    const newManager = this.managersRepository.create({
      ...createManagerDto,
      password: await bcrypt.hash(createManagerDto.password, 10),
    });

    const manager = await this.managersRepository.save(newManager);

    return deleteProperties(manager, ['password']);
  }

  async findAll(options?: FindManyOptions<Manager>): Promise<Manager[]> {
    const managers = await this.managersRepository.find(options);

    return managers;
  }

  async findOne(options: FindOneOptions<Manager>): Promise<Manager> {
    const manager = await this.managersRepository.findOne(options);

    if (manager === null) {
      throw new ManagerNotFoundException();
    }

    return manager;
  }

  findOneById(id: number): Promise<Manager> {
    return this.findOne({ where: { id } });
  }

  async update(
    id: number,
    updateManagerDto: UpdateManagerDto,
  ): Promise<Manager> {
    const manager = await this.findOneById(id);

    const mergedManager = this.managersRepository.merge(
      manager,
      updateManagerDto,
    );

    const updatedManager = await this.managersRepository.save(mergedManager);

    return updatedManager;
  }

  async remove(id: number): Promise<Manager> {
    const manager = await this.findOneById(id);

    const deletedManager = await this.managersRepository.remove(manager);

    return deletedManager;
  }

  async resetPassword(
    id: number | null,
    resetPasswordDto: ResetPasswordDto,
  ): Promise<HttpResponse> {
    const manager = id
      ? await this.managersRepository.findOneBy({
          id,
        })
      : null;

    if (manager === null) {
      throw new ManagerNotFoundException();
    }

    manager.password = await bcrypt.hash(resetPasswordDto.newPassword, 10);

    await this.managersRepository.save(manager);

    return new HttpResponse({
      message: 'Password has been changed successfully!',
      statusCode: HttpStatus.OK,
    });
  }
}
