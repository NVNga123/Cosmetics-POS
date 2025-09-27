import React from 'react';
import type { Order } from '../../../types/order';
import './OrderDetailModal.css';

interface OrderDetailModalProps {
  order: Order | null;
  isOpen: boolean;
  onClose: () => void;
}

export const OrderDetailModal: React.FC<OrderDetailModalProps> = ({ order, isOpen, onClose }) => {
  if (!isOpen || !order) return null;

  const formatPrice = (price: number) => {
    return new Intl.NumberFormat('vi-VN', {
      style: 'currency',
      currency: 'VND'
    }).format(price);
  };

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleString('vi-VN', {
      year: 'numeric',
      month: '2-digit',
      day: '2-digit',
      hour: '2-digit',
      minute: '2-digit'
    });
  };

  const getStatusText = (status: string) => {
    switch (status.toUpperCase()) {
      case 'NEW':
        return 'Mới';
      case 'PENDING':
        return 'Chờ xử lý';
      case 'PROCESSING':
        return 'Đang xử lý';
      case 'COMPLETED':
        return 'Đã hoàn thành';
      case 'CANCELLED':
        return 'Đã hủy';
      default:
        return status;
    }
  };

  const getStatusColor = (status: string) => {
    switch (status.toUpperCase()) {
      case 'NEW':
        return '#3b82f6';
      case 'COMPLETED':
        return '#10b981';
      case 'PENDING':
        return '#f59e0b';
      case 'CANCELLED':
        return '#ef4444';
      default:
        return '#6b7280';
    }
  };

  return (
    <div className="modal-overlay" onClick={onClose}>
      <div className="modal-content" onClick={(e) => e.stopPropagation()}>
        {/* Modal Header */}
        <div className="modal-header">
          <h2>Chi tiết đơn hàng</h2>
          <button className="close-button" onClick={onClose}>
            ✕
          </button>
        </div>

        {/* Modal Body */}
        <div className="modal-body">
          {/* Order Info */}
          <div className="order-info-section">
            <div className="info-grid">
              <div className="info-item">
                <label>Mã đơn hàng:</label>
                <span className="order-code">{order.code}</span>
              </div>
              <div className="info-item">
                <label>Trạng thái:</label>
                <span 
                  className="status-badge"
                  style={{ color: getStatusColor(order.status) }}
                >
                  {getStatusText(order.status)}
                </span>
              </div>
              <div className="info-item">
                <label>Khách hàng:</label>
                <span>{order.customerName || 'Khách lẻ'}</span>
              </div>
              <div className="info-item">
                <label>Ngày tạo:</label>
                <span>{formatDate(order.createdAt)}</span>
              </div>
            </div>
          </div>

          {/* Order Items */}
          <div className="order-items-section">
            <h3>Danh sách sản phẩm</h3>
            <div className="items-table">
              <div className="items-header">
                <div className="col-product">Sản phẩm</div>
                <div className="col-price">Đơn giá</div>
                <div className="col-quantity">Số lượng</div>
                <div className="col-total">Thành tiền</div>
              </div>
              {order.items.map((item, index) => (
                <div key={index} className="item-row">
                  <div className="col-product">
                    <div className="product-info">
                      <span className="product-name">
                        {item.productName || `Sản phẩm ${item.productId}`}
                      </span>
                      <span className="product-id">ID: {item.productId}</span>
                    </div>
                  </div>
                  <div className="col-price">{formatPrice(item.price)}</div>
                  <div className="col-quantity">{item.quantity}</div>
                  <div className="col-total">{formatPrice(item.subtotal)}</div>
                </div>
              ))}
            </div>
          </div>

          {/* Order Summary */}
          <div className="order-summary-section">
            <div className="summary-total">
              <div className="total-label">Tổng cộng:</div>
              <div className="total-amount">{formatPrice(order.total)}</div>
            </div>
          </div>

          {/* Notes */}
          {order.notes && (
            <div className="order-notes-section">
              <h3>Ghi chú</h3>
              <p>{order.notes}</p>
            </div>
          )}
        </div>

        {/* Modal Footer */}
        <div className="modal-footer">
          <button className="btn btn-secondary" onClick={onClose}>
            Đóng
          </button>
          <button className="btn btn-primary">
            In hóa đơn
          </button>
        </div>
      </div>

    </div>
  );
};
