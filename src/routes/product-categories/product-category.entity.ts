import { MaxLength } from 'class-validator';
import { Column, Entity, ManyToMany, PrimaryGeneratedColumn } from 'typeorm';

import { Product } from '../products/product.entity';

@Entity()
export class ProductCategory {
  @PrimaryGeneratedColumn()
  id: number;

  @Column({
    type: 'varchar',
    unique: true,
  })
  @MaxLength(50)
  name: string;

  @Column({
    type: 'varchar',
    unique: true,
  })
  @MaxLength(50)
  slug: string;

  @ManyToMany(() => Product, (product) => product.categories)
  products: Product[];
}
