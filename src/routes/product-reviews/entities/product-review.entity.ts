import { IsInt, Max, MaxLength } from 'class-validator';
import {
  Column,
  CreateDateColumn,
  Entity,
  JoinColumn,
  ManyToOne,
  PrimaryGeneratedColumn,
} from 'typeorm';

import { Product } from '@/routes/products/product.entity';
import { User } from '@/routes/users/entities/user.entity';

@Entity()
export class ProductReview {
  @PrimaryGeneratedColumn()
  id: number;

  @CreateDateColumn({ type: 'timestamptz' })
  createdDate: string | Date;

  @ManyToOne(() => User, (user) => user.productReviews)
  user: User;

  @ManyToOne(() => Product, (product) => product.reviews, {
    onDelete: 'CASCADE',
  })
  @JoinColumn()
  product: Product;

  @Column({
    type: 'int',
  })
  @IsInt()
  @Max(5)
  rating: number;

  @Column({
    type: 'varchar',
    nullable: true,
  })
  @MaxLength(200)
  comment: string | null;
}
