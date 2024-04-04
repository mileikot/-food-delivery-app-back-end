import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { FindManyOptions, FindOneOptions, Repository } from 'typeorm';

import { CheckoutService } from '../checkout/checkout.service';
import { UserNotFoundException } from '../users/exceptions';

import { CreateOrderDto } from './dto/create-order.dto';
import { UpdateOrderDto } from './dto/update-order.dto';
import { Order } from './entities/order.entity';
import { OrderProduct } from './entities/order-product.entity';
import { CalculateOrderProductsDto } from './dto';
import { OrderNotFoundException } from './exceptions';

import { createTrueBasedMap } from '@/utils';

@Injectable()
export class OrdersService {
  constructor(
    @InjectRepository(Order) private orderRepository: Repository<Order>,
    @InjectRepository(OrderProduct)
    private orderProductRepository: Repository<OrderProduct>,
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
      await this.calculateOrderProducts(products);

    const newOrder = this.orderRepository.create({
      total: totalPrice,
      comment,
      user: { id: userId },
    });

    const order = await this.orderRepository.save(newOrder);

    await this.saveOrderProducts(orderProducts, order.id);

    return order;
  }

  findAll(options?: FindManyOptions<Order>): Promise<Order[]> {
    return this.orderRepository.find({
      ...options,
      relations: {
        orderProducts: true,
        user: true,
        ...options?.relations,
      },
    });
  }

  findAllByUserId(id: number | null): Promise<Order[]> {
    if (!id) {
      throw new UserNotFoundException();
    }

    return this.findAll({
      where: { user: { id } },
      relations: {
        user: false,
      },
    });
  }

  async findOne(options: FindOneOptions<Order>): Promise<Order> {
    const order = await this.orderRepository.findOne(options);

    if (order === null) {
      throw new OrderNotFoundException();
    }

    return order;
  }

  findOneById(id: number): Promise<Order> {
    return this.findOne({ where: { id } });
  }

  async update(id: number, updateOrderDto: UpdateOrderDto): Promise<Order> {
    const { products, status } = updateOrderDto;

    const order = await this.orderRepository.findOne({
      where: { id },
      relations: {
        orderProducts: true,
      },
    });

    if (order === null) {
      throw new OrderNotFoundException();
    }

    const { orderProducts, totalPrice } =
      await this.calculateOrderProducts(products);

    const mergedOrder = this.orderRepository.merge(order, {
      status,
      total: totalPrice,
    });

    const { toBeDeletedOrderProducts, toBeSavedOrderProducts } =
      this.transformOrderProducts(order.orderProducts, orderProducts);

    const updatedOrder = await this.orderRepository.save(mergedOrder);

    await this.orderProductRepository.remove(toBeDeletedOrderProducts);

    const savedOrderProducts = await this.saveOrderProducts(
      toBeSavedOrderProducts,
      order.id,
    );

    return {
      ...updatedOrder,
      orderProducts: savedOrderProducts,
    };
  }

  async remove(id: number): Promise<Order> {
    const order = await this.orderRepository.findOne({ where: { id } });

    if (order === null) {
      throw new OrderNotFoundException();
    }

    const removedOrder = await this.orderRepository.remove(order);

    return removedOrder;
  }

  async saveOrderProducts(
    orderProducts: Partial<OrderProduct>[],
    orderId: number,
  ) {
    const newOrderProducts = this.orderProductRepository.create(
      orderProducts.map((product) => ({
        ...product,
        order: { id: orderId },
      })),
    );

    return await this.orderProductRepository.save(newOrderProducts);
  }

  async calculateOrderProducts(products: CalculateOrderProductsDto[]) {
    const { content, totalPrice } = await this.checkoutService.calculate({
      products,
    });

    const orderProducts: Partial<OrderProduct>[] = content.map(
      ({ product, quantity }, index) => ({
        description: product.description,
        price: product.totalPrice,
        quantity,
        title: product.title,
        productId: product.id,
        id: products[index].id,
      }),
    );

    return { totalPrice, orderProducts };
  }

  transformOrderProducts(
    oldOrderProducts: OrderProduct[],
    newOrderProducts: Partial<OrderProduct>[],
  ) {
    const newOrderProductsMap = createTrueBasedMap(newOrderProducts, 'id');

    const toBeSavedOrderProducts = newOrderProducts.map((newOrderProduct) => {
      if (newOrderProduct.id) {
        const existingOrderProduct =
          oldOrderProducts.find(
            (orderProduct) => orderProduct.id === newOrderProduct.id,
          ) ?? new OrderProduct();

        return this.orderProductRepository.merge(
          existingOrderProduct,
          newOrderProduct,
        );
      }

      return newOrderProduct;
    });

    const toBeDeletedOrderProducts = oldOrderProducts.filter(
      (orderProduct) => !newOrderProductsMap[orderProduct.id],
    );

    return {
      toBeSavedOrderProducts,
      toBeDeletedOrderProducts,
    };
  }
}
