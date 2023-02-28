export type ProductStatusesModule =
  typeof import('../constants/productStatuses');

export type ProductStatusesKeys = keyof ProductStatusesModule;

export type ProductStatuses = ProductStatusesModule[ProductStatusesKeys];
