import { Exclude } from 'class-transformer';
import { IsInt, Max, MaxLength } from 'class-validator';
import {
  Column,
  CreateDateColumn,
  Entity,
  JoinColumn,
  ManyToOne,
  PrimaryGeneratedColumn,
  RelationId,
} from 'typeorm';

import { Product } from '@/routes/products/product.entity';
import { User } from '@/routes/users/user.entity';

@Entity()
export class ProductReview {
  @PrimaryGeneratedColumn()
  id: number;

  @CreateDateColumn({ type: 'timestamptz' })
  createdDate: string | Date;

  @ManyToOne(() => User, (user) => user.productReviews)
  user: User;

  @Column()
  @RelationId((review: ProductReview) => review.product)
  productId: number;

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

  @ManyToOne(() => Product, (product) => product.reviews, {
    onDelete: 'CASCADE',
  })
  @JoinColumn()
  @Exclude({ toPlainOnly: true })
  product: Product;
}
