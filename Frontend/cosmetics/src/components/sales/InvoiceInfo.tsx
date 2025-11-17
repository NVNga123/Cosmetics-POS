import React from 'react';
import type { Order } from '../../types/order';
import './InvoiceInfo.css';

interface InvoiceInfoProps {
  order: Order;
  isOpen: boolean;
  onCreateInvoice: () => void;
  onCancel: () => void;
}

export const InvoiceInfo: React.FC<InvoiceInfoProps> = ({
  order,
  isOpen,
  onCreateInvoice,
  onCancel,
}) => {
  if (!isOpen) return null;

  // Tính toán các giá trị
  const subtotal = order.items?.reduce((sum, item) => sum + (item.subtotal || 0), 0) || 0;
  const discount = order.items?.reduce((sum, item) => sum + (item.subtotal - item.total), 0) || 0;
  const discountedSubtotal = subtotal - discount;
  const vat = Math.round(discountedSubtotal * 0.1);
  const total = discountedSubtotal + vat;

  const getPaymentMethodText = (method?: string) => {
    switch (method) {
      case 'cash': return 'Tiền mặt';
      case 'bank': return 'Chuyển khoản ngân hàng';
      case 'momo': return 'Ví MoMo';
      case 'tmck': return 'Tiền mặt + Chuyển khoản';
      default: return 'Chưa xác định';
    }
  };

  return (
    <div className="invoice-info-overlay">
      <div className="invoice-info-modal">
        <div className="invoice-info-header">
          <h2>Thông tin hóa đơn</h2>
          <div className="invoice-status-badge success">
            <i className="fas fa-check-circle"></i>
            Thanh toán thành công
          </div>
        </div>

        <div className="invoice-info-body">
          {/* Thông tin đơn hàng */}
          <div className="invoice-section">
            <h3>Thông tin đơn hàng</h3>
            <div className="invoice-details">
              <div className="detail-row">
                <span className="detail-label">Mã đơn hàng:</span>
                <span className="detail-value">{order.code}</span>
              </div>
              <div className="detail-row">
                <span className="detail-label">Khách hàng:</span>
                <span className="detail-value">{order.customerName || 'Khách lẻ'}</span>
              </div>
              <div className="detail-row">
                <span className="detail-label">Ngày tạo:</span>
                <span className="detail-value">
                  {order.createdDate 
                    ? new Date(order.createdDate).toLocaleString('vi-VN')
                    : new Date().toLocaleString('vi-VN')}
                </span>
              </div>
              <div className="detail-row">
                <span className="detail-label">Phương thức thanh toán:</span>
                <span className="detail-value">{getPaymentMethodText(order.paymentMethod)}</span>
              </div>
              {order.notes && order.notes !== '---' && (
                <div className="detail-row">
                  <span className="detail-label">Ghi chú:</span>
                  <span className="detail-value">{order.notes}</span>
                </div>
              )}
            </div>
          </div>

          {/* Danh sách sản phẩm */}
          <div className="invoice-section">
            <h3>Danh sách sản phẩm</h3>
            <div className="invoice-items">
              <div className="invoice-items-header">
                <div className="item-col name">Tên sản phẩm</div>
                <div className="item-col quantity">SL</div>
                <div className="item-col price">Đơn giá</div>
                <div className="item-col discount">Giảm giá</div>
                <div className="item-col total">Thành tiền</div>
              </div>
              <div className="invoice-items-body">
                {order.items?.map((item, index) => (
                  <div key={index} className="invoice-item-row">
                    <div className="item-col name">
                      {item.product?.name || item.productName || 'Sản phẩm không xác định'}
                    </div>
                    <div className="item-col quantity">{item.quantity}</div>
                    <div className="item-col price">
                      {((item.subtotal || 0) / item.quantity).toLocaleString('vi-VN')}đ
                    </div>
                    <div className="item-col discount">
                      {item.discountAmount ? `-${item.discountAmount.toLocaleString('vi-VN')}đ` : '0đ'}
                    </div>
                    <div className="item-col total">
                      {(item.total || 0).toLocaleString('vi-VN')}đ
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>

          {/* Tổng tiền */}
          <div className="invoice-section">
            <h3>Tổng tiền</h3>
            <div className="invoice-summary">
              <div className="summary-row">
                <span>Tạm tính:</span>
                <span>{subtotal.toLocaleString('vi-VN')}đ</span>
              </div>
              <div className="summary-row">
                <span>Khuyến mãi:</span>
                <span>-{discount.toLocaleString('vi-VN')}đ</span>
              </div>
              <div className="summary-row">
                <span>Thuế VAT (10%):</span>
                <span>{vat.toLocaleString('vi-VN')}đ</span>
              </div>
              <div className="summary-row total-row">
                <span>Tổng thanh toán:</span>
                <span>{total.toLocaleString('vi-VN')}đ</span>
              </div>
            </div>
          </div>
        </div>

        <div className="invoice-info-footer">
          <button className="btn btn-secondary" onClick={onCancel}>
            <i className="fas fa-times"></i>
            Hủy
          </button>
          <button className="btn btn-primary" onClick={onCreateInvoice}>
            <i className="fas fa-file-invoice"></i>
            Tạo hóa đơn
          </button>
        </div>
      </div>
    </div>
  );
};

