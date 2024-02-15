import { Exclude } from 'class-transformer';
import { IsMobilePhone, MinLength } from 'class-validator';
import { Column, Entity, OneToMany, PrimaryGeneratedColumn } from 'typeorm';

import { Order } from '../orders/order.entity';

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

  @Column({
    type: 'varchar',
    array: true,
    select: false,
  })
  @Exclude({ toPlainOnly: true })
  tokens: string[];

  @OneToMany(() => Order, (order) => order.user, {
    onDelete: 'CASCADE',
  })
  orders: Order[];
}
