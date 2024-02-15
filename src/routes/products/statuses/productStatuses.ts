export type ProductStatusesModule = typeof import('./constants');

export type ProductStatusesKeys = keyof ProductStatusesModule;

export type ProductStatuses = ProductStatusesModule[ProductStatusesKeys];
