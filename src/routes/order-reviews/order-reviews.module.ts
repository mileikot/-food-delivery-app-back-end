import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';

import { OrdersModule } from '../orders/orders.module';

import { OrderReview } from './entities/order-review.entity';
import { OrderReviewsController } from './order-reviews.controller';
import { OrderReviewsService } from './order-reviews.service';

@Module({
  imports: [TypeOrmModule.forFeature([OrderReview]), OrdersModule],
  controllers: [OrderReviewsController],
  providers: [OrderReviewsService],
})
export class OrderReviewsModule {}
