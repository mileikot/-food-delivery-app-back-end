type OrderStatusConstantsModule = typeof import('./orderStatusesConstants');

type OrderStatusKeys = keyof OrderStatusConstantsModule;

export type OrderStatuses =
  | 'Pending payment'
  | 'Failed'
  | 'Processing'
  | 'Completed'
  | 'On hold'
  | 'Canceled';

export const orderStatusesMap: Record<OrderStatusKeys, OrderStatuses> = {
  PENDING_PAYMENT: 'Pending payment',
  FAILED: 'Failed',
  PROCESSING: 'Processing',
  COMPLETED: 'Completed',
  ON_HOLD: 'On hold',
  CANCELED: 'Canceled',
};
