import { IsEmail, IsMobilePhone, IsString, MinLength } from 'class-validator';
import {
  Column,
  CreateDateColumn,
  Entity,
  OneToMany,
  PrimaryGeneratedColumn,
  UpdateDateColumn,
} from 'typeorm';

import { Order } from '../../orders/entities/order.entity';
import { ProductReview } from '../../product-reviews/entities/product-review.entity';

import { UserRole } from './user-role.entity';

@Entity()
export class User {
  @PrimaryGeneratedColumn()
  id: number;

  @Column({ type: 'varchar' })
  @IsString()
  firstName: string;

  @Column({ type: 'varchar' })
  @IsString()
  lastName: string;

  @Column({ type: 'varchar' })
  @IsEmail()
  email: string;

  @Column({ type: 'varchar', length: 255 })
  passwordHash: string;

  @Column({
    type: 'varchar',
    unique: true,
    length: 15,
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

  @OneToMany(() => UserRole, (userRoles) => userRoles.user)
  userRoles: UserRole[];

  @CreateDateColumn()
  createdDate: Date;

  @UpdateDateColumn()
  updatedDate: Date;
}
