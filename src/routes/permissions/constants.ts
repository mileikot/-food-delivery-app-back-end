import { PermissionNames } from './types';

export const PERMISSIONS_LIST: { id: number; name: PermissionNames }[] = [
  { id: 1, name: PermissionNames.CREATE_USER },
  { id: 2, name: PermissionNames.DELETE_USER },
  { id: 3, name: PermissionNames.UPDATE_USER },
  { id: 4, name: PermissionNames.VIEW_USER },

  { id: 5, name: PermissionNames.CREATE_PRODUCT },
  { id: 6, name: PermissionNames.DELETE_PRODUCT },
  { id: 7, name: PermissionNames.UPDATE_PRODUCT },
  { id: 8, name: PermissionNames.VIEW_PRODUCT },

  { id: 9, name: PermissionNames.CREATE_ORDER },
  { id: 10, name: PermissionNames.DELETE_ORDER },
  { id: 11, name: PermissionNames.UPDATE_ORDER },
  { id: 12, name: PermissionNames.VIEW_ORDER },

  { id: 13, name: PermissionNames.CREATE_REVIEW },
  { id: 14, name: PermissionNames.DELETE_REVIEW },
  { id: 15, name: PermissionNames.UPDATE_REVIEW },
  { id: 16, name: PermissionNames.VIEW_REVIEW },
];
