export const getStatusText = (status: string) => {
  switch (status.toUpperCase()) {
    case "RETURNED":
      return "Đã trả hàng";
    case "COMPLETED":
      return "Đã hoàn thành";
    case "CANCELLED":
      return "Đã hủy";
    case "DRAFT":
      return "Chưa hoàn thành";
    default:
      return status;
  }
};

export const getStatusColor = (status: string) => {
  switch (status.toUpperCase()) {
    case "COMPLETED":
      return "#10b981";
    case "RETURNED":
      return "#f59e0b";
    case "CANCELLED":
      return "#ef4444";
    case "DRAFT":
      return "#6b7280";
    default:
      return "#6b7280";
  }
};

export const formatPrice = (price: number) => {
  return new Intl.NumberFormat("vi-VN").format(price);
};
