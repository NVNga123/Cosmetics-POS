import React from 'react';
import type { Order } from '../../../types/order';

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

      <style>{`
        .modal-overlay {
          position: fixed;
          top: 0;
          left: 0;
          right: 0;
          bottom: 0;
          background: rgba(0, 0, 0, 0.5);
          display: flex;
          align-items: center;
          justify-content: center;
          z-index: 1000;
          padding: 20px;
        }

        .modal-content {
          background: white;
          border-radius: 12px;
          max-width: 800px;
          width: 100%;
          max-height: 90vh;
          overflow: hidden;
          box-shadow: 0 20px 25px -5px rgba(0, 0, 0, 0.1), 0 10px 10px -5px rgba(0, 0, 0, 0.04);
        }

        .modal-header {
          display: flex;
          justify-content: space-between;
          align-items: center;
          padding: 20px 24px;
          border-bottom: 1px solid #e5e7eb;
          background: #f8fafc;
        }

        .modal-header h2 {
          margin: 0;
          font-size: 20px;
          font-weight: 600;
          color: #111827;
        }

        .close-button {
          background: #ef4444;
          color: white;
          border: none;
          border-radius: 50%;
          width: 32px;
          height: 32px;
          cursor: pointer;
          font-size: 16px;
          display: flex;
          align-items: center;
          justify-content: center;
          transition: background-color 0.2s ease;
        }

        .close-button:hover {
          background: #dc2626;
        }

        .modal-body {
          padding: 24px;
          max-height: 60vh;
          overflow-y: auto;
        }

        .order-info-section {
          margin-bottom: 24px;
        }

        .info-grid {
          display: grid;
          grid-template-columns: repeat(auto-fit, minmax(200px, 1fr));
          gap: 16px;
        }

        .info-item {
          display: flex;
          flex-direction: column;
          gap: 4px;
        }

        .info-item label {
          font-size: 14px;
          font-weight: 500;
          color: #6b7280;
        }

        .info-item span {
          font-size: 16px;
          color: #111827;
        }

        .order-code {
          font-weight: 600;
          color: #2563eb;
        }

        .status-badge {
          font-weight: 500;
          padding: 4px 8px;
          border-radius: 4px;
          background: rgba(59, 130, 246, 0.1);
        }

        .order-items-section {
          margin-bottom: 24px;
        }

        .order-items-section h3 {
          margin: 0 0 16px 0;
          font-size: 18px;
          font-weight: 600;
          color: #374151;
        }

        .items-table {
          border: 1px solid #e5e7eb;
          border-radius: 8px;
          overflow: hidden;
        }

        .items-header {
          display: grid;
          grid-template-columns: 2fr 1fr 1fr 1fr;
          background: #f8fafc;
          padding: 12px 16px;
          font-weight: 600;
          color: #374151;
          font-size: 14px;
        }

        .item-row {
          display: grid;
          grid-template-columns: 2fr 1fr 1fr 1fr;
          padding: 16px;
          border-bottom: 1px solid #f3f4f6;
        }

        .item-row:last-child {
          border-bottom: none;
        }

        .product-info {
          display: flex;
          flex-direction: column;
          gap: 4px;
        }

        .product-name {
          font-weight: 500;
          color: #111827;
        }

        .product-id {
          font-size: 12px;
          color: #6b7280;
        }

        .col-price,
        .col-quantity,
        .col-total {
          display: flex;
          align-items: center;
          justify-content: flex-end;
          font-size: 14px;
        }

        .col-total {
          font-weight: 600;
          color: #059669;
        }

        .order-summary-section {
          border-top: 2px solid #e5e7eb;
          padding-top: 16px;
          margin-bottom: 24px;
        }

        .summary-total {
          display: flex;
          justify-content: space-between;
          align-items: center;
          background: #f8fafc;
          padding: 16px;
          border-radius: 8px;
        }

        .total-label {
          font-size: 18px;
          font-weight: 600;
          color: #374151;
        }

        .total-amount {
          font-size: 20px;
          font-weight: 700;
          color: #059669;
        }

        .order-notes-section h3 {
          margin: 0 0 8px 0;
          font-size: 16px;
          font-weight: 600;
          color: #374151;
        }

        .order-notes-section p {
          margin: 0;
          padding: 12px;
          background: #fef3c7;
          border-radius: 6px;
          color: #92400e;
          font-style: italic;
        }

        .modal-footer {
          display: flex;
          justify-content: flex-end;
          gap: 12px;
          padding: 20px 24px;
          border-top: 1px solid #e5e7eb;
          background: #f8fafc;
        }

        .btn {
          padding: 8px 16px;
          border: none;
          border-radius: 6px;
          cursor: pointer;
          font-size: 14px;
          font-weight: 500;
          transition: all 0.2s ease;
        }

        .btn-secondary {
          background: #6b7280;
          color: white;
        }

        .btn-secondary:hover {
          background: #4b5563;
        }

        .btn-primary {
          background: #2563eb;
          color: white;
        }

        .btn-primary:hover {
          background: #1d4ed8;
        }

        @media (max-width: 768px) {
          .modal-overlay {
            padding: 10px;
          }

          .modal-content {
            max-height: 95vh;
          }

          .modal-body {
            padding: 16px;
          }

          .info-grid {
            grid-template-columns: 1fr;
          }

          .items-header,
          .item-row {
            grid-template-columns: 1fr;
            gap: 8px;
          }

          .col-price,
          .col-quantity,
          .col-total {
            justify-content: flex-start;
          }

          .modal-footer {
            flex-direction: column;
          }
        }
      `}</style>
    </div>
  );
};
