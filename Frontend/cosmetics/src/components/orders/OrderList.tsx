import React from 'react';
import type { Order } from '../../types/order.ts';

interface OrderListProps {
  orders: Order[];
  onViewOrder: (order: Order) => void;
  formatPrice: (price: number) => string;
  getStatusText: (status: string) => string;
  getStatusColor: (status: string) => string;
}

export const OrderList: React.FC<OrderListProps> = ({
  orders,
  onViewOrder,
  formatPrice,
  getStatusText,
  getStatusColor
}) => {
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
            style={{ cursor: "pointer" }}
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
          <td>{order.createdAt}</td>
          <td></td>
          <td>{formatPrice(order.total)}</td>
          <td>TM/CK</td>
          <td>
            <span
              className="status-badge"
              style={{ color: getStatusColor(order.status) }}
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