import { MaxLength, Min, Validate } from 'class-validator';
import {
  Column,
  Entity,
  ManyToOne,
  OneToMany,
  OneToOne,
  PrimaryGeneratedColumn,
} from 'typeorm';

import { OrderReview } from '../../order-reviews/entities/order-review.entity';
import { User } from '../../users/user.entity';
import { OrderStatuses, orderStatusesMap } from '../statuses';
import { OrderStatusValidator } from '../validation';

import { OrderProduct } from './order-product.entity';

@Entity()
export class Order {
  @PrimaryGeneratedColumn()
  id: number;

  @ManyToOne(() => User, (user) => user.orders)
  user: User;

  @Column({
    type: 'int',
    default: orderStatusesMap.PENDING_PAYMENT,
  })
  @Validate(OrderStatusValidator)
  status: OrderStatuses;

  @Column({
    type: 'real',
  })
  @Min(0)
  total: number;

  @Column({
    type: 'timestamptz',
    default: () => 'NOW()',
  })
  date: Date;

  @OneToMany(() => OrderProduct, (orderProduct) => orderProduct.order)
  orderProducts: OrderProduct[];

  @Column({
    type: 'varchar',
    nullable: true,
  })
  @MaxLength(100)
  comment: string;

  @OneToOne(() => OrderReview, (review) => review.order)
  review: OrderReview;
}
