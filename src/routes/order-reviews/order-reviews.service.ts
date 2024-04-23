import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { FindManyOptions, FindOneOptions, Repository } from 'typeorm';

import { OrdersService } from '../orders/orders.service';
import { UserNotFoundException } from '../users/exceptions';

import { CreateOrderReviewDto } from './dto/create-order-review.dto';
import { UpdateOrderReviewDto } from './dto/update-order-review.dto';
import { OrderReview } from './entities/order-review.entity';
import {
  OrderReviewAlreadyExistException,
  OrderReviewNotFoundException,
} from './exceptions';

@Injectable()
export class OrderReviewsService {
  constructor(
    @InjectRepository(OrderReview)
    private readonly orderReviewsRepository: Repository<OrderReview>,
    private readonly ordersService: OrdersService,
  ) {}

  async create(
    createOrderReviewDto: CreateOrderReviewDto,
    userId: number | null,
  ): Promise<OrderReview> {
    const { orderId, ...restDto } = createOrderReviewDto;

    if (!userId) {
      throw new UserNotFoundException();
    }

    const order = await this.ordersService.findOne({
      where: { id: orderId },
      relations: {
        review: true,
      },
    });

    if (order?.review) {
      throw new OrderReviewAlreadyExistException();
    }

    const newReview = this.orderReviewsRepository.create({
      ...restDto,
      order: { id: orderId },
      user: { id: userId },
    });

    const createdReview = await this.orderReviewsRepository.save(newReview);

    return createdReview;
  }

  findAll(options?: FindManyOptions<OrderReview>): Promise<OrderReview[]> {
    return this.orderReviewsRepository.find({
      ...options,
      relations: {
        order: true,
        user: true,
        ...options?.relations,
      },
    });
  }

  async findOne(options: FindOneOptions<OrderReview>): Promise<OrderReview> {
    const review = await this.orderReviewsRepository.findOne({
      ...options,
      relations: {
        order: true,
        user: true,
        ...options?.relations,
      },
    });

    if (review === null) {
      throw new OrderReviewNotFoundException();
    }

    return review;
  }

  findOneById(id: number): Promise<OrderReview> {
    return this.findOne({ where: { id } });
  }

  async update(
    id: number,
    updateOrderReviewDto: UpdateOrderReviewDto,
  ): Promise<OrderReview> {
    const review = await this.findOneById(id);

    const mergedReview = this.orderReviewsRepository.merge(
      review,
      updateOrderReviewDto,
    );

    const updatedReview = await this.orderReviewsRepository.save(mergedReview);

    return updatedReview;
  }

  async remove(id: number): Promise<OrderReview> {
    const review = await this.findOneById(id);

    const deletedReview = await this.orderReviewsRepository.remove(review);

    return deletedReview;
  }
}
