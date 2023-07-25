import { ACTIVE, DRAFT, HIDDEN } from './productStatusConstants';
import { ProductStatuses, ProductStatusesKeys } from './productStatuses';

export const productStatusesMap: Record<ProductStatusesKeys, ProductStatuses> =
  {
    ACTIVE,
    DRAFT,
    HIDDEN,
  };

export const productStatusesList = Object.values(productStatusesMap);
