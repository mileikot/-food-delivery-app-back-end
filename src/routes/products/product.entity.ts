import {
  ArrayNotEmpty,
  Max,
  MaxLength,
  Min,
  MinLength,
  Validate,
} from 'class-validator';
import {
  Column,
  Entity,
  JoinTable,
  ManyToMany,
  OneToMany,
  OneToOne,
  PrimaryGeneratedColumn,
} from 'typeorm';

import { ProductCategory } from '../product-categories/product-category.entity';
import { ProductRating } from '../product-reviews/entities/product-rating.entity';
import { ProductReview } from '../product-reviews/entities/product-review.entity';

import { ProductStatuses } from './statuses/productStatuses';
import { ProductStatusValidator } from './validation';

@Entity()
export class Product {
  @PrimaryGeneratedColumn()
  id: number;

  @Column({
    type: 'varchar',
  })
  @MinLength(5)
  title: string;

  @Column({
    type: 'varchar',
  })
  @MaxLength(500)
  description: string;

  @Column({
    type: 'int',
  })
  @Validate(ProductStatusValidator)
  status: ProductStatuses;

  @Column({
    type: 'float',
  })
  @Min(0)
  price: number;

  @Column({
    type: 'float',
  })
  @Min(0)
  totalPrice: number;

  @Column({
    type: 'int',
    nullable: true,
  })
  @Max(100)
  discount: number | null;

  @Column({
    type: 'varchar',
    nullable: true,
  })
  imageName: string | null;

  @ManyToMany(() => ProductCategory, (category) => category.products)
  @JoinTable()
  @ArrayNotEmpty()
  categories: ProductCategory[];

  @OneToMany(() => ProductReview, (review) => review.product)
  reviews: ProductReview[];

  @OneToOne(() => ProductRating, (rating) => rating.product, {
    eager: true,
  })
  rating: ProductRating;

  imageUrl: string;
}
