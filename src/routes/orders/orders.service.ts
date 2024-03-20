import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { FindManyOptions, Repository } from 'typeorm';

import { CheckoutService } from '../checkout/checkout.service';
import { CheckoutProductDto } from '../checkout/dto';
import { UserNotFoundException } from '../users/exceptions';

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

  async create(
    createOrderDto: CreateOrderDto,
    userId: number | null,
  ): Promise<Order> {
    const { products, comment } = createOrderDto;

    if (!userId) {
      throw new UserNotFoundException();
    }

    const { orderProducts, totalPrice } =
      await this.transformOrderProducts(products);

    const newOrder = this.orderRepository.create({
      total: totalPrice,
      products: orderProducts,
      comment,
      ownerId: userId,
    });

    const order = await this.orderRepository.save(newOrder);

    return order;
  }

  async findAll(filter?: FindManyOptions<Order>): Promise<Order[]> {
    return this.orderRepository.find({
      ...filter,
    });
  }

  async findAllByOwnerId(id: number | null): Promise<Order[]> {
    if (!id) {
      throw new UserNotFoundException();
    }

    return this.findAll({
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
    const { products, status } = updateOrderDto;

    const order = await this.orderRepository.findOne({ where: { id } });

    if (order === null) {
      throw new OrderNotFoundException(id);
    }

    const { orderProducts, totalPrice } =
      await this.transformOrderProducts(products);

    const mergedOrder = this.orderRepository.merge(order, {
      products: orderProducts,
      status,
      total: totalPrice,
    });

    const updatedOrder = await this.orderRepository.save(mergedOrder);

    return updatedOrder;
  }

  async remove(id: number): Promise<Order> {
    const order = await this.orderRepository.findOne({ where: { id } });

    if (order === null) {
      throw new OrderNotFoundException(id);
    }

    const removedOrder = await this.orderRepository.remove(order);

    return removedOrder;
  }

  async transformOrderProducts(products: CheckoutProductDto[]) {
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

    return { totalPrice, orderProducts };
  }
}
