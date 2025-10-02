// Order Status Constants
export const ORDER_STATUS = {
  DRAFT: 'DRAFT',
  COMPLETED: 'COMPLETED',
  CANCELLED: 'CANCELLED',
  RETURNED: 'RETURNED'
} as const;

// Order Status Labels
export const ORDER_STATUS_LABELS = {
  [ORDER_STATUS.DRAFT]: 'Chưa hoàn thành',
  [ORDER_STATUS.COMPLETED]: 'Đã hoàn thành',
  [ORDER_STATUS.CANCELLED]: 'Đã hủy',
  [ORDER_STATUS.RETURNED]: 'Đã trả hàng'
} as const;

// Order Status Colors
export const ORDER_STATUS_COLORS = {
  [ORDER_STATUS.DRAFT]: '#6b7280',
  [ORDER_STATUS.COMPLETED]: '#10b981',
  [ORDER_STATUS.CANCELLED]: '#ef4444',
  [ORDER_STATUS.RETURNED]: '#f59e0b'
} as const;

// Utility Functions
export const getStatusText = (status: string): string => {
  const upperStatus = status.toUpperCase();
  return ORDER_STATUS_LABELS[upperStatus as keyof typeof ORDER_STATUS_LABELS] || status;
};

export const getStatusColor = (status: string): string => {
  const upperStatus = status.toUpperCase();
  return ORDER_STATUS_COLORS[upperStatus as keyof typeof ORDER_STATUS_COLORS] || '#6b7280';
};
