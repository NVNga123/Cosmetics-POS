// Re-export from constants
export { getStatusText, getStatusColor } from '../constants/orderStatus.constants';

export const formatPrice = (price: number) => {
  return new Intl.NumberFormat("vi-VN").format(price);
};

export const getPaymentMethodText = (paymentMethod?: string) => {
  if (!paymentMethod) return 'Chưa chọn';
  
  const paymentMethods: { [key: string]: string } = {
    'cash': 'Tiền mặt',
    'momo': 'MoMo',
    'bank': 'Ngân hàng',
    'tmck': 'TMCK'
  };
  
  return paymentMethods[paymentMethod] || paymentMethod;
};