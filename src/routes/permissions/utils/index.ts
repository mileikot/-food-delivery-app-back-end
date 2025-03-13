import { PermissionNames } from '../types';

export const matchPermissions = (
  requiredPermissions: PermissionNames[],
  currentUserPermossions: PermissionNames[] | null,
) => {
  if (!currentUserPermossions) {
    return false;
  }

  return requiredPermissions.every((permission) =>
    currentUserPermossions.includes(permission),
  );
};
