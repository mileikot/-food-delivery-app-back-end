import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { FindManyOptions, FindOneOptions, Repository } from 'typeorm';

import { OrderNotFoundException } from '../orders/exceptions';
import { OrdersService } from '../orders/orders.service';

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
  ): Promise<OrderReview> {
    const { orderId, ...restDto } = createOrderReviewDto;

    const order = await this.ordersService.findOne({
      where: { id: orderId },
      relations: ['review'],
    });

    if (!order) {
      throw new OrderNotFoundException();
    }

    if (order?.review) {
      throw new OrderReviewAlreadyExistException();
    }

    const newReview = this.orderReviewsRepository.create({
      ...restDto,
      order: { id: orderId },
    });

    const createdReview = await this.orderReviewsRepository.save(newReview);

    return createdReview;
  }

  async findAll(
    options?: FindManyOptions<OrderReview>,
  ): Promise<OrderReview[]> {
    const reviews = await this.orderReviewsRepository.find(options);

    return reviews;
  }

  async findOne(options: FindOneOptions<OrderReview>): Promise<OrderReview> {
    const review = await this.orderReviewsRepository.findOne(options);

    if (review === null) {
      throw new OrderReviewNotFoundException();
    }

    return review;
  }

  async findOneById(id: number): Promise<OrderReview> {
    const review = await this.findOne({
      where: { id },
    });

    if (review === null) {
      throw new OrderReviewNotFoundException();
    }

    return review;
  }

  async update(
    id: number,
    updateOrderReviewDto: UpdateOrderReviewDto,
  ): Promise<OrderReview> {
    const review = await this.orderReviewsRepository.findOne({
      where: { id },
      loadRelationIds: true,
    });

    if (!review) {
      throw new OrderReviewNotFoundException();
    }

    const mergedReview = this.orderReviewsRepository.merge(
      review,
      updateOrderReviewDto,
    );

    const updatedReview = await this.orderReviewsRepository.save(mergedReview);

    return updatedReview;
  }

  async remove(id: number): Promise<OrderReview> {
    const review = await this.orderReviewsRepository.findOneBy({ id });

    if (!review) {
      throw new OrderReviewNotFoundException();
    }

    const deletedReview = await this.orderReviewsRepository.remove(review);

    return deletedReview;
  }
}
