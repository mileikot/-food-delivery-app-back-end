import { IsInt, Max, MaxLength } from 'class-validator';
import {
  Column,
  CreateDateColumn,
  Entity,
  JoinColumn,
  ManyToOne,
  OneToOne,
  PrimaryGeneratedColumn,
} from 'typeorm';

import { Order } from '@/routes/orders/entities/order.entity';
import { User } from '@/routes/users/entities/user.entity';

@Entity()
export class OrderReview {
  @PrimaryGeneratedColumn()
  id: number;

  @CreateDateColumn({ type: 'timestamptz' })
  createdDate: string | Date;

  @ManyToOne(() => User, (user) => user.productReviews)
  user: User;

  @OneToOne(() => Order, (order) => order.review, {
    onDelete: 'CASCADE',
  })
  @JoinColumn()
  order: Order;

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
