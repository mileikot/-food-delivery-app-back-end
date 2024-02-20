import { IsMobilePhone, MinLength } from 'class-validator';
import { BaseEntity, Column, Entity, PrimaryGeneratedColumn } from 'typeorm';

@Entity()
export class PhoneNumberVerification extends BaseEntity {
  @PrimaryGeneratedColumn()
  id: number;

  @Column({
    type: 'varchar',
    unique: true,
  })
  @MinLength(7)
  @IsMobilePhone()
  phoneNumber: string;

  @Column({ type: 'varchar' })
  oneTimePassword: string;
}
