import { IsInt, IsNumber, Max } from 'class-validator';
import {
  Column,
  Entity,
  JoinColumn,
  OneToOne,
  PrimaryGeneratedColumn,
} from 'typeorm';

import { Product } from '@/routes/products/product.entity';

@Entity()
export class ProductRating {
  @PrimaryGeneratedColumn()
  id: number;

  @OneToOne(() => Product, (product) => product.rating, {
    onDelete: 'CASCADE',
  })
  @JoinColumn()
  product: Product;

  @Column({
    type: 'float',
    nullable: true,
    default: null,
  })
  @IsNumber()
  @Max(5)
  avgRating: number | null;

  @Column({
    type: 'int',
    default: 0,
  })
  @IsInt()
  reviewsAmount: number;
}
