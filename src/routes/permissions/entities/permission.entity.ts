import {
  Column,
  CreateDateColumn,
  Entity,
  ManyToMany,
  OneToMany,
  PrimaryGeneratedColumn,
  UpdateDateColumn,
} from 'typeorm';

import { PermissionNames } from '../types';

import { Role } from '@/routes/roles/entities/role.entity';
import { RolePermission } from '@/routes/roles/entities/role-permission.entity';

@Entity()
export class Permission {
  @PrimaryGeneratedColumn()
  id: number;

  @Column({ type: 'varchar' })
  permissionName: PermissionNames;

  @OneToMany(
    () => RolePermission,
    (rolePermissions) => rolePermissions.permission,
  )
  rolePermissions: RolePermission[];

  @ManyToMany(() => Role, (role) => role.permissions)
  roles: Role[];

  @CreateDateColumn()
  createdDate: Date;

  @UpdateDateColumn()
  updatedDate: Date;
}
