import { IsInt, MaxLength, Min, MinLength } from 'class-validator';
import { Column, Entity, ManyToOne, PrimaryGeneratedColumn } from 'typeorm';

import { Order } from './order.entity';

@Entity()
export class OrderProduct {
  @PrimaryGeneratedColumn()
  id: number;

  @Column({
    type: 'int',
  })
  @IsInt()
  productId: number;

  @ManyToOne(() => Order, (order) => order.orderProducts)
  order: Order;

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
  @IsInt()
  @Min(1)
  quantity: number;

  @Column({
    type: 'float',
  })
  @Min(0)
  price: number;
}
