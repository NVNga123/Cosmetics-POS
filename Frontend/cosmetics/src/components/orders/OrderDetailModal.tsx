import React, { useState, useEffect, useRef } from 'react';
import type { Order } from '../../types/order.ts';
import './OrderDetailModal.css';

interface OrderDetailModalProps {
  order: Order | null;
  isOpen: boolean;
  onClose: () => void;
}

export const OrderDetailModal: React.FC<OrderDetailModalProps> = ({
                                                                     order,
                                                                     isOpen,
                                                                     onClose
                                                                   }) => {
  const [menuOpen, setMenuOpen] = useState(false);
  const dropdownRef = useRef<HTMLDivElement>(null);
  const [dropdownPosition, setDropdownPosition] = useState({ top: 0, left: 0 });

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target as Node)) {
        setMenuOpen(false);
      }
    };

    if (menuOpen) {
      document.addEventListener('mousedown', handleClickOutside);
    }

    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, [menuOpen]);

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
      case 'RETURNED':
        return 'Đã trả hàng';
      case 'COMPLETED':
        return 'Đã hoàn thành';
      case 'CANCELLED':
        return 'Đã hủy';
      case 'DRAFT':
        return 'Chưa hoàn thành';
      default:
        return status;
    }
  };

  const getStatusColor = (status: string) => {
    switch (status.toUpperCase()) {
      case 'COMPLETED':
        return '#10b981';
      case 'RETURNED':
        return '#f59e0b';
      case 'CANCELLED':
        return '#ef4444';
      case 'DRAFT':
        return '#6b7280';
      default:
        return '#6b7280';
    }
  };

  const handleCancelOrder = () => {
    console.log('Huỷ đơn hàng');
    setMenuOpen(false);
  };

  const handleReturnOrder = () => {
    console.log('Trả hàng');
    setMenuOpen(false);
  };

  const handleMenuToggle = () => {
    console.log('Menu toggle clicked, current state:', menuOpen);
    if (!menuOpen && dropdownRef.current) {
      const rect = dropdownRef.current.getBoundingClientRect();
        const newPosition = {
          top: rect.top - 90,
          left: rect.right - 70,
        };
      console.log('Button rect:', rect);
      console.log('Calculated position:', newPosition);
      setDropdownPosition(newPosition);
    }
    setMenuOpen(!menuOpen);
    console.log('Menu state after toggle:', !menuOpen);
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
                        {item.product?.name || `Sản phẩm ${item.product?.id || 'N/A'}`}
                      </span>
                          <span className="product-id">ID: {item.product?.id || 'N/A'}</span>
                        </div>
                      </div>
                      <div className="col-price">{formatPrice(item.product?.price || 0)}</div>
                      <div className="col-quantity">{item.quantity}</div>
                      <div className="col-total">{formatPrice(item.subtotal || 0)}</div>
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

            {order.status === 'DRAFT' && (
                <button className="btn btn-warning btn-icon" onClick={handleCancelOrder}>
                  ✖ Huỷ
                </button>
            )}

            {order.status === 'CANCELLED' && (
                <button className="btn btn-danger btn-icon">
                  🗑️ Xoá
                </button>
            )}

             {order.status === 'COMPLETED' && (
                 <div className="dropdown-wrapper" ref={dropdownRef}>
                   <button
                       className="btn btn-primary btn-icon"
                       onClick={handleMenuToggle}
                   >
                     ☰
                   </button>

                   {menuOpen && (
                       <div className="order-dropdown-menu" style={{ 
                         position: 'fixed', 
                         top: `${dropdownPosition.top}px`,
                         left: `${dropdownPosition.left}px`,
                         background: 'white', 
                         border: '1px solid #ccc', 
                         zIndex: 99999,
                         width: '120px',
                         maxWidth: '120px',
                         minWidth: '120px',
                         transform: 'none'
                       }}>
                         <button onClick={handleCancelOrder}>Huỷ đơn hàng</button>
                         <button onClick={handleReturnOrder}>Trả hàng</button>
                       </div>
                   )}
                 </div>
             )}
          </div>
        </div>
      </div>
  );
};
