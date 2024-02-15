type OrderStatusConstantsModule = typeof import('./constants');

export type OrderStatusKeys = keyof OrderStatusConstantsModule;

export type OrderStatuses = OrderStatusConstantsModule[OrderStatusKeys];
