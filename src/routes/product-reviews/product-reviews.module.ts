import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';

import { ProductsModule } from '../products/products.module';

import { ProductRating } from './entities/product-rating.entity';
import { ProductReview } from './entities/product-review.entity';
import { ProductRatingService } from './product-rating.service';
import { ProductReviewsController } from './product-reviews.controller';
import { ProductReviewsService } from './product-reviews.service';

@Module({
  imports: [
    TypeOrmModule.forFeature([ProductReview, ProductRating]),
    ProductsModule,
  ],
  controllers: [ProductReviewsController],
  providers: [ProductReviewsService, ProductRatingService],
})
export class ProductReviewsModule {}
