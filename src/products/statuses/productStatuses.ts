export type ProductStatusesModule = typeof import('./productStatusConstants');

export type ProductStatusesKeys = keyof ProductStatusesModule;

export type ProductStatuses = ProductStatusesModule[ProductStatusesKeys];
