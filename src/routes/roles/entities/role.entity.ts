import { IsString } from 'class-validator';
import {
  Column,
  CreateDateColumn,
  Entity,
  JoinTable,
  ManyToMany,
  OneToMany,
  PrimaryGeneratedColumn,
  UpdateDateColumn,
} from 'typeorm';

import { RolePermission } from './role-permission.entity';

import { Permission } from '@/routes/permissions/entities/permission.entity';
import { User } from '@/routes/users/entities/user.entity';
import { UserRole } from '@/routes/users/entities/user-role.entity';

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

  @ManyToMany(() => User, (user) => user.roles)
  users: User[];

  @OneToMany(() => RolePermission, (rolePermissions) => rolePermissions.role)
  rolePermissions: RolePermission[];

  @ManyToMany(() => Permission, (permission) => permission.roles)
  @JoinTable()
  permissions: Permission[];

  @CreateDateColumn()
  createdDate: Date;

  @UpdateDateColumn()
  updatedDate: Date;
}
