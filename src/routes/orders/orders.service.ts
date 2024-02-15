import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { FindManyOptions, Repository } from 'typeorm';

import { CheckoutService } from '../checkout/checkout.service';
import { User } from '../users/user.entity';

import { CreateOrderDto } from './dto/create-order.dto';
import { UpdateOrderDto } from './dto/update-order.dto';
import { OrderProductDto } from './dto';
import { OrderNotFoundException } from './exceptions';
import { Order } from './order.entity';

@Injectable()
export class OrdersService {
  constructor(
    @InjectRepository(Order) private orderRepository: Repository<Order>,
    private readonly checkoutService: CheckoutService,
  ) {}

  async create(createOrderDto: CreateOrderDto, user: User): Promise<Order> {
    const { products, comment } = createOrderDto;

    const { content, totalPrice } = await this.checkoutService.calculate({
      products,
    });

    const orderProducts: OrderProductDto[] = content.map(
      ({ product, quantity }) => ({
        id: product.id,
        description: product.description,
        price: product.totalPrice,
        quantity,
        title: product.title,
      }),
    );

    const order = await this.orderRepository.save({
      total: totalPrice,
      products: orderProducts,
      comment,
      ownerId: user.id,
    });

    return order;
  }

  async findAll(filter?: FindManyOptions<Order>): Promise<Order[]> {
    return await this.orderRepository.find({
      ...filter,
    });
  }

  async findAllByOwnerId(id: number): Promise<Order[]> {
    return await this.findAll({
      where: { user: { id } },
    });
  }

  async findOne(id: number): Promise<Order> {
    const order = await this.orderRepository.findOne({ where: { id } });

    if (order === null) {
      throw new OrderNotFoundException(id);
    }

    return order;
  }

  async update(id: number, updateOrderDto: UpdateOrderDto): Promise<Order> {
    const order = await this.orderRepository.findOne({ where: { id } });

    if (order === null) {
      throw new OrderNotFoundException(id);
    }

    const mergedOrder = this.orderRepository.merge(order, updateOrderDto);

    const updatedOrder = await this.orderRepository.save(mergedOrder);

    return updatedOrder;
  }

  async remove(id: number): Promise<Order> {
    const order = await this.orderRepository.findOne({ where: { id } });

    if (order === null) {
      throw new OrderNotFoundException(id);
    }

    const removedOrder = await this.orderRepository.remove(order);

    return {
      ...removedOrder,
      id,
    };
  }
}
