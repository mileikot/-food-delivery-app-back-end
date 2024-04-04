import { IsMobilePhone, MinLength } from 'class-validator';
import { Column, Entity, OneToMany, PrimaryGeneratedColumn } from 'typeorm';

import { Order } from '../orders/entities/order.entity';
import { ProductReview } from '../product-reviews/entities/product-review.entity';

@Entity()
export class User {
  @PrimaryGeneratedColumn()
  id: number;

  @Column({ type: 'varchar' })
  firstName: string;

  @Column({ type: 'varchar' })
  lastName: string;

  @Column({
    type: 'varchar',
    unique: true,
  })
  @MinLength(7)
  @IsMobilePhone()
  phoneNumber: string;

  @OneToMany(() => Order, (order) => order.user, {
    onDelete: 'CASCADE',
  })
  orders: Order[];

  @OneToMany(() => ProductReview, (review) => review.user, {
    onDelete: 'CASCADE',
  })
  productReviews: ProductReview[];
}
