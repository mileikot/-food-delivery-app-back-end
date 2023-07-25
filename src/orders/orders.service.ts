import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';

import { RequestWithUser } from '../types/common';
import { UserDocument } from '../users/entities/user.entity';

import { CreateOrderDto } from './dto/create-order.dto';
import { UpdateOrderDto } from './dto/update-order.dto';
import { Order, OrderDocument } from './entities/order.entity';

@Injectable()
export class OrdersService {
  constructor(
    @InjectModel(Order.name) private readonly orderModel: Model<OrderDocument>,
  ) {}

  async create(createOrderDto: CreateOrderDto, request: RequestWithUser) {
    return await this.orderModel.create({
      ...createOrderDto,
      owner: request.user._id,
    });
  }

  async getMyOrders(request: RequestWithUser): Promise<OrderDocument[]> {
    await request.user.populate<UserDocument>('orders');

    return request.user.orders;
  }

  findOne(id: number) {
    return `This action returns a #${id} order`;
  }

  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  update(id: number, updateOrderDto: UpdateOrderDto) {
    return `This action updates a #${id} order`;
  }

  remove(id: number) {
    return `This action removes a #${id} order`;
  }
}
