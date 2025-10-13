import React from 'react';
import type { OrderListProps } from '../../types/order.ts';

export const OrderList: React.FC<OrderListProps> = ({
  orders,
  onViewOrder,
  formatPrice,
  getStatusText,
  getStatusColor,
  getPaymentMethodText
}) => {
  
  const formatDate = (dateString: string | undefined) => {
    if (!dateString) return 'N/A';
    
    try {
      // Xử lý timestamp Unix (milliseconds)
      if (typeof dateString === 'number' || /^\d+$/.test(dateString)) {
        const timestamp = typeof dateString === 'number' ? dateString : parseInt(dateString);
        // Kiểm tra nếu là timestamp Unix (seconds) thì chuyển thành milliseconds
        const date = timestamp < 10000000000 ? new Date(timestamp * 1000) : new Date(timestamp);
        return date.toLocaleString("vi-VN");
      }
      
      // Xử lý ISO string hoặc date string
      const date = new Date(dateString);
      if (isNaN(date.getTime())) return 'N/A';
      
      return date.toLocaleString("vi-VN");
    } catch (error) {
      console.error('Error formatting date:', error);
      return 'N/A';
    }
  };

  if (orders.length === 0) {
    return (
      <tr>
        <td colSpan={9} style={{ textAlign: "center", padding: "40px" }}>
          <div className="empty-state">
            <div className="empty-icon">📦</div>
            <h3>Chưa có đơn hàng nào</h3>
            <p>Khi có đơn hàng mới, chúng sẽ xuất hiện ở đây.</p>
          </div>
        </td>
      </tr>
    );
  }

  return (
    <>
      {orders.map((order, index) => (
          <tr key={order.orderId}>
            <td>{index + 1}</td>
            <td
                onClick={() => onViewOrder(order)}
                title="Xem chi tiết"
                style={{cursor: "pointer"}}
            >
              {order.code}
            </td>
            <td>
              <div className="customer-info">
              <span>
                Tên khách hàng: {order.customerName || "Khách lẻ"}
              </span>
              </div>
            </td>
            <td>{formatDate(order.createdDate)}</td>
            <td></td>
            <td>{formatPrice(order.total)}</td>
            <td>{getPaymentMethodText(order.paymentMethod)}</td>
            <td>
            <span
                className="status-badge"
                style={{color: getStatusColor(order.status)}}
            >
              {getStatusText(order.status)}
            </span>
            </td>
            <td>
              <button
                  className="action-btn menu-btn"
                  onClick={() => onViewOrder(order)}
                  title="Xem chi tiết"
              >
                ☰
              </button>
            </td>
          </tr>
      ))}
    </>
  );
};