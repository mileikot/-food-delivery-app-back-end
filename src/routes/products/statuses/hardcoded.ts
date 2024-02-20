import { ACTIVE, DRAFT, HIDDEN } from './constants';

export const productStatusesMap = {
  ACTIVE,
  DRAFT,
  HIDDEN,
} as const;

export const productStatusesList = Object.values(productStatusesMap);
