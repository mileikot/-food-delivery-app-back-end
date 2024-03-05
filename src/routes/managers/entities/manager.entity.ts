import { Exclude } from 'class-transformer';
import { IsEmail, MaxLength, MinLength } from 'class-validator';
import { Column, Entity, PrimaryGeneratedColumn } from 'typeorm';

@Entity()
export class Manager {
  @PrimaryGeneratedColumn()
  id: number;

  @Column({
    type: 'varchar',
  })
  @MinLength(2)
  @MaxLength(16)
  firstName: string;

  @Column({
    type: 'varchar',
  })
  @MinLength(2)
  @MaxLength(16)
  lastName: string;

  @Column({
    type: 'varchar',
  })
  @IsEmail()
  email: string;

  @Column({
    type: 'varchar',
    select: false,
  })
  @Exclude({ toPlainOnly: true })
  @MinLength(8)
  @MaxLength(16)
  password: string;
}
