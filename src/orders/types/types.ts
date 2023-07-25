type OrderStatusConstantsModule = typeof import('./orderStatusesConstants');

type OrderStatusKeys = keyof OrderStatusConstantsModule;

export type OrderStatuses = 1 | 2 | 3 | 4 | 5 | 6;

export const orderStatusesMap: Record<OrderStatusKeys, OrderStatuses> = {
  PENDING_PAYMENT: 1,
  FAILED: 2,
  PROCESSING: 3,
  COMPLETED: 4,
  ON_HOLD: 5,
  CANCELED: 6,
};
