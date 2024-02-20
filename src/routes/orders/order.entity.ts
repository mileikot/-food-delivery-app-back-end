import { Exclude } from 'class-transformer';
import { MaxLength, Min, Validate } from 'class-validator';
import {
  Column,
  Entity,
  Generated,
  JoinColumn,
  ManyToOne,
  PrimaryGeneratedColumn,
} from 'typeorm';

import { User } from '../users/user.entity';

import { OrderProductDto } from './dto/order-product.dto';
import { OrderStatuses, orderStatusesMap } from './statuses';
import { OrderStatusValidator } from './validation';

@Entity()
export class Order {
  @PrimaryGeneratedColumn()
  id: number;

  @Column({
    type: 'int',
  })
  @Generated('increment')
  orderId: number;

  @Column({
    type: 'int',
  })
  ownerId: number;

  @Column({
    type: 'int',
    default: orderStatusesMap.PENDING_PAYMENT,
  })
  @Validate(OrderStatusValidator)
  status: OrderStatuses;

  @Column({
    type: 'int',
  })
  @Min(0)
  total: number;

  @Column({
    type: 'timestamptz',
    default: () => 'NOW()',
  })
  date: Date;

  @Column({
    type: 'jsonb',
  })
  products: OrderProductDto[];

  @Column({
    type: 'varchar',
    nullable: true,
  })
  @MaxLength(100)
  comment: string;

  @ManyToOne(() => User, (user) => user.orders)
  @JoinColumn({ name: 'ownerId' })
  @Exclude({ toPlainOnly: true })
  user: User;
}
