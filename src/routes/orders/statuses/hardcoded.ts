import {
  CANCELED,
  COMPLETED,
  FAILED,
  ON_HOLD,
  PENDING_PAYMENT,
  PROCESSING,
} from './constants';

export const orderStatusesMap = {
  CANCELED,
  COMPLETED,
  FAILED,
  ON_HOLD,
  PENDING_PAYMENT,
  PROCESSING,
} as const;

export const orderStatusesList = Object.values(orderStatusesMap);
