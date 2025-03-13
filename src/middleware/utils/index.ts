import { PermissionNames } from '@/routes/permissions/types';
import { Role } from '@/routes/roles/entities/role.entity';

export const getPermissionsArrayFromRoles = (
  roles: Role[],
): PermissionNames[] => {
  return roles.reduce((accumulator, role) => {
    const permissionNames: PermissionNames[] = role.permissions.map(
      (permission) => {
        return permission.permissionName;
      },
    );

    return [...accumulator, ...permissionNames];
  }, []);
};
