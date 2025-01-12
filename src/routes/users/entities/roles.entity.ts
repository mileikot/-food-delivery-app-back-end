import { IsString } from 'class-validator';
import {
  Column,
  CreateDateColumn,
  Entity,
  OneToMany,
  PrimaryGeneratedColumn,
  UpdateDateColumn,
} from 'typeorm';

import { RolePermission } from './role-permission.entity';
import { UserRole } from './user-role.entity';

@Entity()
export class Role {
  @PrimaryGeneratedColumn()
  id: number;

  @Column({
    type: 'varchar',
  })
  @IsString()
  roleName: string;

  @OneToMany(() => UserRole, (userRoles) => userRoles.role)
  userRoles: UserRole[];

  @OneToMany(() => RolePermission, (rolePermissions) => rolePermissions.role)
  rolePermissions: RolePermission[];

  @CreateDateColumn()
  createdDate: Date;

  @UpdateDateColumn()
  updatedDate: Date;
}
