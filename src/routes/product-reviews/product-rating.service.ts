import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';

import { CreateProductRatingDto } from './dto/create-product-rating.dto';
import { ProductRating } from './entities/product-rating.entity';
import { ProductRatingNotFoundException } from './exceptions';
import { ProductRatingCalculation } from './types';

@Injectable()
export class ProductRatingService {
  constructor(
    @InjectRepository(ProductRating)
    private readonly productRatingRepository: Repository<ProductRating>,
  ) {}

  async increase(
    createProductRatingDto: CreateProductRatingDto,
  ): Promise<ProductRating> {
    const { productId, rating } = createProductRatingDto;

    const existingRating = await this.productRatingRepository.findOne({
      where: { product: { id: productId } },
    });

    if (existingRating) {
      const { newAvgRating, newReviewsAmount } = this.calculateIncreasedRating(
        existingRating.avgRating ?? 0,
        existingRating.reviewsAmount,
        rating,
      );

      existingRating.avgRating = newAvgRating;
      existingRating.reviewsAmount = newReviewsAmount;

      const updatedRating =
        await this.productRatingRepository.save(existingRating);

      return updatedRating;
    } else {
      const newRating = this.productRatingRepository.create({
        product: { id: productId },
        reviewsAmount: 1,
        avgRating: rating,
      });

      const createdRating = await this.productRatingRepository.save(newRating);

      return createdRating;
    }
  }

  async decrease(
    reduceProductRatingDto: CreateProductRatingDto,
  ): Promise<ProductRating> {
    const { productId, rating } = reduceProductRatingDto;

    const existingRating = await this.productRatingRepository.findOne({
      where: { product: { id: productId } },
    });

    if (!existingRating) {
      throw new ProductRatingNotFoundException();
    }

    const { newAvgRating, newReviewsAmount } = this.calculateDecreasedRating(
      existingRating.avgRating ?? 0,
      existingRating.reviewsAmount,
      rating,
    );

    existingRating.avgRating = newAvgRating;
    existingRating.reviewsAmount = newReviewsAmount;

    const updatedRating =
      await this.productRatingRepository.save(existingRating);

    return updatedRating;
  }

  private calculateIncreasedRating(
    currentAvgRating: number,
    currentReviewsAmount: number,
    newRating: number,
  ): ProductRatingCalculation {
    const currentDividend = currentAvgRating * currentReviewsAmount;

    const newReviewsAmount = currentReviewsAmount + 1;

    const newAvgRating = (currentDividend + newRating) / newReviewsAmount;

    return { newAvgRating, newReviewsAmount };
  }

  private calculateDecreasedRating(
    currentAvgRating: number,
    currentReviewsAmount: number,
    rating: number | number[],
  ): ProductRatingCalculation {
    let newAvgRating: number | null = null;
    let newReviewsAmount: number | null = null;

    const currentDividend = currentAvgRating * currentReviewsAmount;

    if (Array.isArray(rating)) {
      const count = rating.length;
      const sum = rating.reduce((acc, value) => acc + value, 0);

      newReviewsAmount = currentReviewsAmount - count;

      newAvgRating = (currentDividend - sum) / newReviewsAmount;
    } else {
      newReviewsAmount = currentReviewsAmount - 1;

      newAvgRating = (currentDividend - rating) / newReviewsAmount;
    }

    return { newAvgRating, newReviewsAmount };
  }
}
