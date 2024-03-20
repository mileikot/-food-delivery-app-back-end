import { Exclude } from 'class-transformer';
import { IsInt, Max, MaxLength } from 'class-validator';
import {
  Column,
  Entity,
  JoinColumn,
  OneToOne,
  PrimaryGeneratedColumn,
  RelationId,
} from 'typeorm';

import { Order } from '@/routes/orders/order.entity';

@Entity()
export class OrderReview {
  @PrimaryGeneratedColumn()
  id: number;

  @RelationId((review: OrderReview) => review.order)
  orderId: number;

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

  @OneToOne(() => Order, (order) => order.review, {
    onDelete: 'CASCADE',
  })
  @JoinColumn()
  @Exclude({ toPlainOnly: true })
  order: Order;
}
