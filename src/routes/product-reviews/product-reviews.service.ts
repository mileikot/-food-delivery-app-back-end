import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { FindManyOptions, FindOneOptions, Repository } from 'typeorm';

import { ProductNotFoundException } from '../products/exceptions';
import { ProductsService } from '../products/products.service';
import { UserNotFoundException } from '../users/exceptions';

import { CreateProductReviewDto } from './dto/create-product-review.dto';
import { UpdateProductReviewDto } from './dto/update-product-review.dto';
import { ProductReview } from './entities/product-review.entity';
import { ProductReviewNotFoundException } from './exceptions';
import { ProductRatingService } from './product-rating.service';

@Injectable()
export class ProductReviewsService {
  constructor(
    @InjectRepository(ProductReview)
    private readonly productReviewsRepository: Repository<ProductReview>,
    private readonly productsService: ProductsService,
    private readonly productRatingService: ProductRatingService,
  ) {}

  async create(
    createProductReviewDto: CreateProductReviewDto,
    userId: number | null,
  ): Promise<ProductReview> {
    const { productId, comment, rating } = createProductReviewDto;

    if (!userId) {
      throw new UserNotFoundException();
    }

    const product = await this.productsService.findOneById(productId);

    if (!product) {
      throw new ProductNotFoundException();
    }

    const newReview = this.productReviewsRepository.create({
      comment,
      rating,
      product: { id: product.id },
      user: { id: userId },
    });

    const createdReview = await this.productReviewsRepository.save(newReview);

    await this.productRatingService.increase({
      productId,
      rating,
    });

    return createdReview;
  }

  async findAll(
    options?: FindManyOptions<ProductReview>,
  ): Promise<ProductReview[]> {
    const reviews = await this.productReviewsRepository.find(options);

    return reviews;
  }

  async findAllByProductId(id: number): Promise<ProductReview[]> {
    const reviews = await this.productReviewsRepository.find({
      where: { product: { id } },
    });

    return reviews;
  }

  async findOne(
    options: FindOneOptions<ProductReview>,
  ): Promise<ProductReview> {
    const review = await this.productReviewsRepository.findOne(options);

    if (review === null) {
      throw new ProductReviewNotFoundException();
    }

    return review;
  }

  async findOneById(id: number): Promise<ProductReview> {
    const review = await this.findOne({
      where: { id },
    });

    if (review === null) {
      throw new ProductReviewNotFoundException();
    }

    return review;
  }

  async update(
    id: number,
    updateProductReviewDto: UpdateProductReviewDto,
  ): Promise<ProductReview> {
    const review = await this.productReviewsRepository.findOne({
      where: { id },
      loadRelationIds: true,
    });

    if (!review) {
      throw new ProductReviewNotFoundException();
    }

    const mergedReview = this.productReviewsRepository.merge(
      review,
      updateProductReviewDto,
    );

    const updatedReview =
      await this.productReviewsRepository.save(mergedReview);

    return updatedReview;
  }

  async remove(id: number): Promise<ProductReview> {
    const review = await this.productReviewsRepository.findOneBy({ id });

    if (!review) {
      throw new ProductReviewNotFoundException();
    }

    const deletedReview = await this.productReviewsRepository.remove(review);

    await this.productRatingService.decrease({
      productId: review.product.id,
      rating: review.rating,
    });

    return deletedReview;
  }
}
