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
  PrimaryGeneratedColumn,
} from 'typeorm';

import { ProductCategory } from '../product-categories/product-category.entity';

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
    type: 'float',
    nullable: true,
  })
  @Max(5)
  rating: number | null;

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

  @ManyToMany(() => ProductCategory, (category) => category.products, {
    eager: true,
  })
  @JoinTable()
  @ArrayNotEmpty()
  categories: ProductCategory[];

  public imageUrl: string;
}
