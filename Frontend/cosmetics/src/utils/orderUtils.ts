// Re-export from constants
export { getStatusText, getStatusColor } from '../constants/orderStatus.constants';

export const formatPrice = (price: number) => {
  return new Intl.NumberFormat("vi-VN").format(price);
};
